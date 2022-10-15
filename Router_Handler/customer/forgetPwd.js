//======================================================================================
// Forget Password Module
//======================================================================================

var request = require('request')
var apikey = "";

// Render forget password page
module.exports.renderForgetPwd = (req, res, next) => {
    res.render('forgetPwd.html', {
        user: req.session.user
    })
}

// Render Result after sending email
module.exports.renderForgetPwdResult = (req, res, next) => {
    res.render('forgetPwdResult.html', {
        user: req.session.user
    })
}

// Sending email for resetting password
module.exports.forgetPwdForm = (req, response) => {
    var formData = req.body;
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/ForgetPassword',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}