const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = (passport) =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
          User.findOne({id: jwt_payload._id})
        .then(user =>{
            if(user){
                return done(null, user);
            }
            return done(null, false);
        }).catch(err =>{
            
            return done(err, false);
            })
        })
    )
}