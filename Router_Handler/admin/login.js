//======================================================================================
// Login Block for Admin
//======================================================================================
var request = require('request')
var adminid = "";
var adminapi = "";
/**
 * 
 * Render login page for admin
 * @returns 
 */
module.exports.renderLoginPage = (req, res, next) => {
    res.render('./oa/login.html')
}

/**
 * 
 * The function for login in 
 * @returns 
 */
module.exports.loginForm = (req, response, next) => {
    var options = {
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }
    request(options, function (err, res, data) {
        adminapi = data;
        req.session.adminapi = adminapi
        var username = JSON.parse(options.body).email

        request.get({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetCurrentUsers',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + adminapi
            }
        }, (err, res, data) => {

            if (res.body == "") {
                response.status(200).json({
                    err_code: 1,
                    message: 'Email or password is invalid.'
                })
            } else {
                if (username != 'admin@maalu.com') {
                    return response.status(200).json({
                        err_code: 2,
                        message: 'No Authorization!'
                    })
                }
                var admin = JSON.parse(res.body)
                req.session.admin = admin;
                adminid = admin.id;
                response.status(200).json({
                    err_code: 0,
                    message: 'OK'
                })
            }
        })
    })
}

/**
 * 
 * The function for login out
 * @returns 
 */
module.exports.loginout = (req, res) => {
    req.session.admin = null
    res.redirect('/oa/login')
}