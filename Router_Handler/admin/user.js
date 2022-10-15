//======================================================================================
// User Block for Admin
//======================================================================================
var request = require('request')

/**
 * 
 * Render user list page for admin
 * @returns 
 */
module.exports.renderUserPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUsers',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        result.forEach(element => {
            element.role = 'Customer'
            if (element.email == 'admin@maalu.com') {
                element.role = 'Administrator'
            }

        });
        res.render('./oa/user.html', {
            result: result,
            admin: req.session.admin
        })
    });
}

/**
 * 
 * The function to view user detail
 * @returns 
 */
module.exports.viewUser = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var userid = req.query.id;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUserById?Id=' + userid,
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        res.render('./oa/userView.html', {
            result: result,
            admin: req.session.admin
        })
    });
}