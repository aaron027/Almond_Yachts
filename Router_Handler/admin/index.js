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

                res.render('./oa/index.html', {
                    admin: req.session.admin,
                    itemsize: itemsize,
                    ordersize: ordersize,
                    usersize: usersize,
                    sumtotal: sumtotal,
                    todayOrders: todayOrders
                })
            });
        });
    });
}