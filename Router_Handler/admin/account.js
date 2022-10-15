//======================================================================================
// Account Block for Admin
//======================================================================================
var request = require('request')

/**
 * 
 * Render profile page for admin
 * @returns 
 */
module.exports.renderProfilePage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    res.render('./oa/profile.html', {
        admin: req.session.admin
    })
}

/**
 * 
 * Render account page for admin
 * @returns 
 */
module.exports.renderAccountPage = function (req, res) {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    res.render('./oa/account.html', {
        admin: req.session.admin
    })
}

/**
 * 
 * The function to edit account info
 * @returns 
 */
module.exports.editAccount = (req, response, next) => {
    var formData = req.body;
    formData.zipCode = parseInt(formData.zipCode)
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdateUsers',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {

        var result = res.body
        req.session.admin = req.body
        response.redirect('/oa/account')
    })
}

/**
 * 
 * Render profile page for admin
 * @returns 
 */
module.exports.renderChangePwd = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    res.render('./oa/changePwd.html', {
        admin: req.session.admin
    })
}


/**
 * 
 * The function to change password for admin
 * @returns 
 */
module.exports.changePwd = (req, response, next) => {
    var formData = req.body;
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/ResetPassword',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        if (res.statusCode == 400) {
            response.status(200).json({
                err_code: 1,
                message: 'The current password does not match!'
            })
        }
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}