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
            // const transporter = nodemailer.createTransport({
            //   host: 'smtp.live.com',
            //   port: 587,
            //   auth: {
            //     user: 'almondboats01@hotmail.com',
            //     pass: '20031105Ab'
            //   }
            // });

            // // send email
            // transporter.sendMail({
            //   from: 'almondboats01@hotmail.com',
            //   to: user.email,
            //   subject: 'Registeration Information',
            //   text: 'Thank you for joining us! Your username is: ' + user.email
            // });
            response.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        }
    })
}