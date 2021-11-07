//======================================================================================
// Order Module
//======================================================================================
var request = require('request')
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars')

// The function for place order
module.exports.placeOrder = (req, response, next) => {
    var formData = req.body;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var orderDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    formData.orderDate = orderDate;
    formData.boatId = parseInt(formData.boatId)
    formData.categoryId = parseInt(formData.categoryId)
    // Get current Datetime
    var currentDate = new Date().toISOString().split('T')[0];
    var arr = currentDate.split('-');
    var year = arr[0];
    var month = arr[1];
    var day = arr[2];
    var days = new Date(year, month, 0);
    days = days.getDate();
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    // Calculate the delivery time according to order date 
    // Set the delivery time for one month after order date
    var estDelivery = year2 + '-' + month2 + '-' + day2;
    estDelivery = new Date(estDelivery).toISOString()

    var sumPrice = 0;
    var itemList = [];

    // loop the formdate of items and put them in array for later use
    for (var item in formData) {
        if (item.indexOf("engine") != -1) {
            sumPrice += parseInt(JSON.stringify(formData[item]).split('_')[1])
            itemList.push(parseInt(JSON.stringify(formData[item]).split('_')[0].replace(/\"/g, "")))
        } else {
        }
    }

    // loop the item list and create json format for item information
    var detailInfo = []
    itemList.forEach((element, index) => {
        detailInfo.push({
            itemId: element
        })
    })
    // put item detail in the json format 
    formData.orderDetails = detailInfo
    formData.price = sumPrice
    formData.estimatedDeliveryDate = estDelivery
    var firstName = formData.firstName;
    var lastName = formData.lastName;
    var email = formData.email;

    //When users place order without logging in, we create an account automatically for the user
    if (formData.customerId == '') {
        var createdpassword = 'Almond@123'
        req.session.createdpassword = createdpassword
        request.post({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/Signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: createdpassword
            })
        }, (err, res, data) => {
            if (data == 'Email Already Exists, Please Provide  Another Email') {
                return response.status(200).json({
                    err_code: 2,
                    message: 'Email Exists'
                })
            }
            var newuser = JSON.parse(res.body);
            req.session.user = newuser
            req.session.newuser = newuser;
            formData.customerId = newuser.id
            request.post({
                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }, (err, res, data) => {
                var orderDetailInfos = JSON.parse(res.body);
                req.session.currentOrderInfo = orderDetailInfos
                request.get({
                    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, (err, res2, data) => {
                    var items = JSON.parse(res2.body);

                    // Deduct item quantity after placed order
                    for (var i in items) {
                        for (var j in orderDetailInfos.orderDetails) {
                            if (items[i].itemId == orderDetailInfos.orderDetails[j].itemId) {

                                items[i].quantityRemaining = parseInt(items[i].quantityRemaining) - 1;
                                request.put({
                                    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items/' + items[i].itemId,
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        itemId: items[i].itemId,
                                        itemName: items[i].itemName,
                                        quantity: items[i].quantity,
                                        quantityRemaining: items[i].quantityRemaining,
                                        unitPrice: items[i].unitPrice,
                                        weight: items[i].weight,
                                        size: items[i].size,
                                        origin: items[i].origin,
                                        supplierId: items[i].supplierId,
                                        sectionId: items[i].sectionId
                                    })
                                }, (err, res, data) => {
                                    var result = res.body
                                    req.session.items = result
                                    response.status(200).json({
                                        err_code: 0,
                                        message: 'OK'
                                    })
                                })

                            }
                        }
                    }

                    req.session.save(function (err) {
                        response.status(200).json({
                            err_code: 0,
                            message: 'ok!'
                        })
                    })
                })
            })
        })
    } else {
        // the logged in status to place order
        req.session.newuser = null;
        var useremail = req.session.user.email;
        request.post({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }, (err, res, data) => {
            var orderDetailInfos = JSON.parse(res.body);
            req.session.currentOrderInfo = orderDetailInfos
            request.get({
                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (err, res2, data) => {
                var items = JSON.parse(res2.body);
                // Deduct item quantity after placed order
                var selectedItemsforUser = []
                var selectedSum = 0;
                for (var i in items) {
                    for (var j in orderDetailInfos.orderDetails) {
                        if (items[i].itemId == orderDetailInfos.orderDetails[j].itemId) {
                            selectedItemsforUser.push(items[i])
                            selectedSum += items[i].unitPrice;
                            items[i].quantityRemaining = parseInt(items[i].quantityRemaining) - 1;
                            request.put({
                                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items/' + items[i].itemId,
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    itemId: items[i].itemId,
                                    itemName: items[i].itemName,
                                    quantity: items[i].quantity,
                                    quantityRemaining: items[i].quantityRemaining,
                                    unitPrice: items[i].unitPrice,
                                    weight: items[i].weight,
                                    size: items[i].size,
                                    origin: items[i].origin,
                                    supplierId: items[i].supplierId,
                                    sectionId: items[i].sectionId
                                })
                            }, (err, res, data) => {
                                var result = res.body
                                req.session.items = result
                                response.status(200).json({
                                    err_code: 0,
                                    message: 'OK'
                                })
                            })
                        }
                    }
                }

                req.session.save(function (err) {
                    response.status(200).json({
                        err_code: 0,
                        message: 'ok!'
                    })
                })

                // Reference: https://stackoverflow.com/questions/45302010/how-to-use-handlebars-with-nodemailer-to-send-email
                // create transporter object with smtp server details
                var transporter = nodemailer.createTransport(smtpTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'noreplyalmondboats@gmail.com',
                        pass: 'Manpower123'
                    }
                }));

                var options = {
                    viewEngine: {
                        extname: '.handlebars',
                        layoutsDir: 'views/',
                        defaultLayout: 'orderConfirmation',
                    },
                    viewPath: 'views/'
                }

                // Render template html to email
                transporter.use('compile', hbs(options));
                var itemLength = selectedItemsforUser.length
                var userFirstName = req.session.user.firstName
                var orderid = orderDetailInfos.orderId
                var orderDate = orderDetailInfos.orderDate
                var zipCode = req.session.user.zipCode
                var address = req.session.user.address1
                var state = req.session.user.state
                var country = req.session.user.country
                var mailOptions = {
                    from: 'noreplyalmondboats@gmail.com',
                    to: useremail,
                    subject: 'Order Confirmation',
                    text: 'Thank you for your order',
                    template: 'orderConfirmation',
                    context: {
                        username: userFirstName,
                        orderId: '2020110500' + orderid,
                        address: address,
                        country: country,
                        state: state,
                        zipCode: zipCode,
                        selectedItemsforUser: selectedItemsforUser,
                        selectedSum: selectedSum,
                        itemLength: itemLength,
                        orderDate: orderDate
                    }
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

            })

        })
    }
}

//Render order Result after placing the order
module.exports.showResult = (req, res, next) => {
    var currentOrderInfo = req.session.currentOrderInfo;
    var boatId = currentOrderInfo.boatId;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var boats = JSON.parse(response.body);
        var foundBoat = boats.find(element => element.id == boatId);
        var categoryId = foundBoat.categoryId
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, response) {
            if (error) return error;
            var categories = JSON.parse(response.body);
            var foundCategory = categories.find(element => element.categoryId == categoryId);
            res.render('orderResult.html', {
                user: req.session.user,
                newuser: req.session.newuser,
                currentOrderInfo: currentOrderInfo,
                foundBoat: foundBoat,
                foundCategory: foundCategory,
                createdpassword: req.session.createdpassword
            })
        });
    });
}