const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');



const secret = process.env.JWT_KEY

//user signup
const userRegister =  async (userDets, role, res)=>{
    let emailNotRegistered =  await validateEmail(userDets.email);
    if(!emailNotRegistered){
       return res.status(400).json({
           message: 'Email is already registered',
           success: false
       })
    }

    const password =  await bcrypt.hash(userDets.password, 10);
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: userDets.email,
        password: password,
        role
    });
    await  user.save()
    .then(result=>{
        return res.status(201).json({
            message: 'Successfuly registered, now login',
            success: true
        })
    })
   .catch(err=>{
       console.log(err)
    res.status(500).json({
        message: 'Unable to register',
        success: false
    })
   })
}

//user login
const userLogin = async(userCreds, role,res)=>{
    let { email, password } = userCreds;

    let user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({
            message: 'Email is not found. Invalid login credentials',
            success: false
        })
    }

    //check role
    if(user.role != role){
        return res.status(403).json({
            message: 'Please make sure you are login in from the right portal',
            success: false
        })
    }

    // That means user exists and trying to login from the right portal
    //Now check for password
    let isMatch = await bcrypt.compare(password, user.password);
    if(isMatch) {
        let token  = jwt.sign({
            _id: new mongoose.Types.ObjectId(),
            role: user.role,
            email: user.email
        }, process.env.JWT_KEY,
        { expiresIn: "7 days"});

        let result = {
            email: user.email,
            role: user.role,
            token: `Bearer ${token}`,
            expiresIn: 168
        }

        return res.status(200).json({
            message: 'You are now logged in',
            success: true,
            result
        })
    } else{
        return res.status(403).json({
            message: 'Incorrect password',
            success: false
        })
    }

}



//Passport middlewware
const userAuth = passport.authenticate('jwt', { session: false })

//check role middleware
const checkRole =  roles => (req, res, next)=>{
      
    if(roles.includes(req.user.role)) {
        return next();
    }
    return res.status(403).json({
        message: 'Unauthorized',
        success: false
    })
   

}

//reset password request





// function authorize(roles = []) {
//     // roles param can be a single role string (e.g. Role.User or 'User') 
//     // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
//     if (typeof roles === 'string') {
//         roles = [roles];
//     }

//     return [
//         // authenticate JWT token and attach user to request object (req.user)
//         jwt({ secret, algorithms: ['HS256'] }),

//         // authorize based on user role
//         (req, res, next) => {
//             if (roles.length && !roles.includes(req.user.role)) {
//                 // user's role is not authorized
//                 return res.status(401).json({ message: 'Unauthorized' });
//             }

//             // authentication and authorization successful
//             next();
//         }
//     ];
// }


const validateEmail =  async email =>{
    let user =  await User.findOne({ email });
    return user ? false: true;
}

const serializeUser = user =>{
    return {
        email: user.email,
        _id: new mongoose.Types.ObjectId(),

    }
}

module.exports = {
    checkRole,
    userAuth,
    userRegister,
    userLogin,
    serializeUser
}