//======================================================================================
// Order Module
//======================================================================================
var request = require('request')


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
            }, (err, res2, data) => {
                var result = JSON.parse(res2.body);
                req.session.currentOrderInfo = result
                response.status(200).json({
                    err_code: 0,
                    message: 'ok!'
                })
            })
        })
    }

    // the logged in status to place order
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = JSON.parse(res.body);
        req.session.currentOrderInfo = result
        response.status(200).json({
            err_code: 0,
            message: 'ok!'
        })
    })
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
        console.log(foundBoat)
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