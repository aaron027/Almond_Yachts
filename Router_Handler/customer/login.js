//======================================================================================
// Login Block
//======================================================================================
var request = require('request')


/**
 * Render Login Page
 * 
 */

module.exports.loginUser = (req, res, next) => {
    res.render('login.html')
}

/**
 * 
 * The function for login in 
 */
module.exports.loginUserForm = (req, response, next) => {
    var options = {
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }
    request(options, function (err, res, data) {
        apikey = data;
        request.get({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetCurrentUsers',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apikey
            }
        }, (err, res, data) => {
            if (res.body == "") {
                response.status(200).json({
                    err_code: 1,
                    message: 'Email or password is invalid.'
                })
            } else {
                var user = JSON.parse(res.body)
                req.session.user = user;
                userid = user.id;
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
 */
module.exports.logout = (req, res, next) => {
    req.session.user = null
    res.redirect('/login')
}

