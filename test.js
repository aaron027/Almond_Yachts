var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars')

// create transporter object with smtp server details
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'noreplyalmondboats@gmail.com',
        pass: 'Manpower123'
    }
}));

var options = {
    viewEngine: {
        extname: '.handlebars',
        layoutsDir: 'views/',
        defaultLayout: 'test',
    },
    viewPath: 'views/'
}

transporter.use('compile', hbs(options));

var mailOptions = {
    from: 'noreplyalmondboats@gmail.com',
    to: 'adrien027@hotmail.com',
    subject: 'Order Confirmation',
    text: 'Thank you for your order',
    template: 'test'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});