//======================================================================================
// Index Block for Admin
//======================================================================================

var request = require('request')
/**
 * 
 * Render order list page for admin
 * @returns 
 */
module.exports.renderOrderPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, res1) {
        if (error) return error;
        var orders = JSON.parse(res1.body);
        req.session.orders = orders
        request.get({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res2, data) => {
            if (error) return error;
            var boats = JSON.parse(res2.body);
            request(options, function (error, response) {
                if (error) return error;
                var result = JSON.parse(response.body);
                req.session.orders = result
                request.get({
                    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, (err, res3, data) => {
                    if (error) return error;
                    var categories = JSON.parse(res3.body);
                    req.session.categories = categories
                    var boatarray = [];
                    var boatcategoryarr = [];
                    orders.forEach(element1 => {
                        boats.forEach(element2 => {
                            if (element1.boatId == element2.id) {
                                boatarray.push(element2)
                            }
                        });
                    });
                    boatarray.forEach(element1 => {
                        categories.forEach(element2 => {
                            if (element1.categoryId == element2.categoryId) {
                                boatcategoryarr.push(element2)
                            }
                        });
                    });
                    req.session.boats = boats;

                    res.render('./oa/order.html', {
                        orders: orders,
                        boats: boatarray,
                        admin: req.session.admin,
                        categories: boatcategoryarr
                    })
                })

            });
        })
    });
}

/**
 * 
 * Render order edit page for admin
 * @returns 
 */
module.exports.renderOrderEditPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var orderid = parseInt(req.query.id);
    request.get({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res1, data) => {
        var orders = JSON.parse(res1.body)
        var found = orders.find(element => element.orderId == orderid);
        var customerId = found.customerId;

        request.get({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res2, data) => {
            var boats = JSON.parse(res2.body)
            var boatid = found.boatId;
            var foundBoat = boats.find(element => element.id == boatid);
            req.session.orderSingle = found;
            var categoryid = foundBoat.categoryId;
            request.get({
                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + categoryid,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (err, res3, data) => {
                var categoryResult = JSON.parse(res3.body)
                request.get({
                    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUserById?Id=' + customerId,
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, (err, res4, data) => {
                    var cutomerFound = JSON.parse(res4.body)
                    request.get({
                        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/OrderDetails/GetOrderDetailsByOrderId?orderId=' + orderid,
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, (err, res5, data) => {
                        var orderDetails = JSON.parse(res5.body)

                        request.get({
                            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }, (err, res6, data) => {
                            var items = JSON.parse(res6.body)
                            var foundArr = []
                            for (var i in orderDetails) {
                                for (var j in items) {
                                    if (orderDetails[i].itemId == items[j].itemId) {
                                        foundArr.push(items[j])
                                    }
                                }
                            }
                            request.get({
                                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
                                method: 'get',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }, (err, res7, data) => {
                                var sections = JSON.parse(res7.body)
                                var foundArrSection = []
                                for (var i in foundArr) {
                                    for (var j in sections) {
                                        if (foundArr[i].sectionId == sections[j].sectionId) {

                                            foundArrSection.push(sections[j])
                                        }
                                    }
                                }
                                res.render('./oa/orderEdit.html', {
                                    admin: req.session.admin,
                                    orderSingle: found,
                                    categoryInfo: categoryResult,
                                    foundBoat: foundBoat,
                                    cutomerFound: cutomerFound,
                                    foundArr: foundArr,
                                    foundArrSection: foundArrSection
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

/**
 * 
 * The function to edit order
 * @returns 
 */
module.exports.editOrder = (req, response, next) => {
    var formData = req.body;
    var orderid = formData.orderId;
    formData.orderId = parseInt(formData.orderId)
    formData.boatId = parseInt(formData.boatId)
    formData.price = parseInt(formData.price)
    formData.boats = null
    formData.applicationUser = null
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.orders = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to delete order
 * @returns 
 */
module.exports.deleteOrder = (req, response) => {
    var orderid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.orders = result
        response.redirect('/oa/order')
    })

}