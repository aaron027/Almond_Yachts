//======================================================================================
// Register Block
//======================================================================================
var request = require('request')

/**
 * 
 * Render register page
 * @returns 
 */
module.exports.renderRegPage = (req, res, next) => {
    res.render('register.html')
}

/**
* 
* The function for Register
* @returns 
*/
module.exports.userRegForm = (req, response, next) => {
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/Signup',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }, (err, res, data) => {
        var result = JSON.parse(res.body);
        if (result.status === 401) {
            response.status(200).json({
                err_code: 1,
                message: 'The email exits!'
            })
        } else {
            var user = JSON.parse(res.body)
            req.session.user = user;

            response.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        }
    })
}