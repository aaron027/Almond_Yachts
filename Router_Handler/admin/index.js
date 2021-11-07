//======================================================================================
// Index Block for Admin
//======================================================================================

var request = require('request')
/**
 * 
 * Render index page for admin
 * @returns 
 */
module.exports.indexPage = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        var itemsize = result.length;
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, res2) {
            if (error) return error;
            var orderresult = JSON.parse(res2.body);
            var sumtotal = 0;
            var d = new Date();
            var month = d.getMonth();
            var day = d.getDate();
            var today = d.getFullYear() + '-' + (month < 10 ? '0' : '') + (month + 1) + '-' + (day < 10 ? '0' : '') + day
            var todayOrders = []
            orderresult.forEach(element => {
                sumtotal += element.price;
                var orderDate = element.orderDate.split('T')[0]
                if (orderDate == today) {
                    todayOrders.push(element)
                }
            });

            var orderDateArr = []
            for (var i in orderresult) {
                orderDateArr.push(new Date(orderresult[i].orderDate).getDay())
            }
            var GroupByWeek = []
            var weekdays = [0, 1, 2, 3, 4, 5, 6]
            for (var i in weekdays) {
                var temp = []
                for (var j in orderDateArr) {
                    if (weekdays[i] == orderDateArr[j]) {
                        temp.push(orderDateArr[j])
                    }
                }
                GroupByWeek.push(temp)
            }
            var orderCountByDay = []
            for (var i in GroupByWeek) {
                orderCountByDay.push(GroupByWeek[i].length)
            }

            var ordersize = orderresult.length;
            var options = {
                'method': 'GET',
                'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUsers',
                'headers': {
                    'Content-Type': 'application/json'
                }
            };
            request(options, function (error, res3) {
                if (error) return error;
                var userresult = JSON.parse(res3.body);
                var usersize = userresult.length
                var options = {
                    'method': 'GET',
                    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                };
                request(options, function (error, res4) {
                    if (error) return error;
                    var boats = JSON.parse(res4.body);
                    var boattemp = []
                    for (var i in orderresult) {
                        for (var j in boats) {
                            if (orderresult[i].boatId == boats[j].id) {
                                boattemp[i] = boats[j]
                            }
                        }
                    }
                    var options = {
                        'method': 'GET',
                        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    };
                    request(options, function (error, res5) {
                        if (error) return error;
                        var categories = JSON.parse(res5.body);
                        var boattemp = []
                        for (var i in orderresult) {
                            for (var j in boats) {
                                if (orderresult[i].boatId == boats[j].id) {
                                    boattemp[i] = boats[j]
                                }
                            }
                        }

                        // The function for calculating total orders for two categories
                        var sum = [];
                        for (var i in categories) {
                            var temp = []
                            for (var j in boattemp) {
                                if (boattemp[j].categoryId == categories[i].categoryId) {
                                    temp.push(boattemp[j])
                                }
                            }
                            sum.push(temp);
                        }

                        res.render('./oa/index.html', {
                            admin: req.session.admin,
                            itemsize: itemsize,
                            ordersize: ordersize,
                            usersize: usersize,
                            sumtotal: sumtotal,
                            todayOrders: todayOrders,
                            sum: sum,
                            orderCountByDay: orderCountByDay
                        })
                    });
                });

            });
        });
    });
}