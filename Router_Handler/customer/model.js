//======================================================================================
// Index and Model Module
//======================================================================================
var request = require('request')

//Render Model page
module.exports.modelPage = (req, res, next) => {
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories', // get category Date from API
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, res1) {
        if (error) return error;
        var categoryresults = JSON.parse(res1.body);
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',  // get boat Date from API
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, res2) {
            if (error) return error;
            var result = JSON.parse(res2.body);
            result.forEach(element => element.category = categoryresults[element.categoryId - 1]);
            var lightShipCategory = result.filter(element => element.categoryId == 1)
            var CruisingCategory = result.filter(element => element.categoryId == 2)

            res.render('model.html', {
                result: result,
                user: req.session.user,
                categoryresults: categoryresults,
                lightShipCategory: lightShipCategory,
                CruisingCategory: CruisingCategory
            })
        });
    });

}