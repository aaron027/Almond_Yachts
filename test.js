var nodeoutlook = require('nodejs-nodemailer-outlook')
var nodemailer = require("nodemailer");
const promisify = require("es6-promisify");

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    host: 'smtp.live.com',
    port: 587,
    auth: {
        user: 'almondboats01@hotmail.com',
        pass: '20031105Ab'
    }
});

// send email
transporter.sendMail({
    from: 'almondboats01@hotmail.com',
    to: '499710703@qq.com',
    subject: 'Test Email Subject',
    text: 'Example Plain Text Message Body'
});