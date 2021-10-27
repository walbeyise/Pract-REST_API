const User = require('../models/user');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mail = require('../middlewares/mail');
const bcrypt = require('bcrypt')
// ===PASSWORD RECOVER AND RESET

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) 
            return res.status(401).json({
                message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
            });

            //Generate and set password reset token
            user.generatePasswordReset();

            // Save the updated user object
        
                    // send email
                    let link = user.resetPasswordToken;
                    const html = ` Hello ${req.body.email},

                    <br/>
                    <br/>
                    Please use this token ${link} to reset your password.<br/>
                    If you did not request this, please ignore this email and your password will remain unchanged.`
                 

                    mail.sendEmail('wilx234@gmail.com', 'Password reset token', req.body.email, html )
            user.save()
            .then(user=>{
                console.log(link)
                res.status(200).json({
                    message: 'An email has been sent to ' + user.email
                })
            }).catch(err => 
                res.status(500).json({
                    message: err.message
                }));
        })
        .catch(err => res.status(500).json({message: err.message}));
};

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public
exports.reset = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        })
        .catch(err => res.status(500).json({message: err.message}));
};


// @route POST api/auth/reset
// @desc Reset Password
// @access Public
exports.resetPassword = async(req, res) => {
   await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then(async(user) => {
            if (!user) return res.status(401).json({
                message: 'Password reset token is invalid or has expired.'
            });

            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.email = req.body.email;
          

                // send email
                const html = ` Hi ${user.email},
                <br/>
                This is a confirmation that the password for your account <br/>
                ${user.email} has just been changed `
            

                mail.sendEmail('wilx24@gmail.com', 'Password has  been changed', user.email, html)
                    
                const password =  await bcrypt.hash(user.password, 10);
                user.password = password
                user.save()
                .then(user=>{
                    
                    res.status(200).json({
                        message: 'Password was changed',
                        success: true
                    })
                    }).catch(err=>{
                        res.status(500).json({
                            message: err.message
                        })
                })
                });
            
    
        
    
};


