const nodemailer = require('nodemailer')
const config = require('../utils/mailer')

//Creating or building the transport object
const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    service: "Gmail",
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }

})
module.exports = {

//Making use of the Transport Object
    sendEmail(from, subject, to, html){
        return new Promise((resolve, reject) =>{
            transport.sendMail({ from, subject, to, html}, (err, info) => {
                if(err) reject(err);
                resolve(info);
            });
        });
    }

}