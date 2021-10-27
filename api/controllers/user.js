
const { userRegister, userLogin, requestPasswordReset, resetPassword } = require('../utils/Auth');

const User = require('../models/user');

exports.user_signup = async(req,res,next)=>{
    await userRegister(req.body, 'user', res);
}

exports.admin_signup = async(req,res,next)=>{
    await userRegister(req.body, 'admin', res);
}


exports.user_login = async(req,res,next)=>{
    await userLogin(req.body, 'user', res)
 }

 exports.admin_login = async(req,res,next)=>{
     await userLogin(req.body, 'admin', res)
 }

 exports.user_delete = (req,res,next)=>{
    User.remove({_id: req.params.userId })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}

exports.requestPasswordReset = async(req,res,next)=>{
    const requestPasswordResetService =   await requestPasswordReset(req.body.email);
    return res.json(requestPasswordResetService);
}

exports.resetPassword = async(req,res,next)=>{
    const resetPasswordService = await resetPassword(
        req.body._id,
        req.body.token,
        req.body.password
    )
    return res.json(resetPasswordService)
}