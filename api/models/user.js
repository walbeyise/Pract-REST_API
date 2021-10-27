const mongoose = require('mongoose');

const crypto = require('crypto');


const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { 
        type: String, required: true 
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'superadmin']
    },
    resetPasswordToken: {
        type: String,
        required: false,
      },
      resetPasswordExpires: {
        type: Date,
        required: false
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,// this is the expiry time in seconds
      }

}, { timestamp: true },
    
)

// UserSchema.pre('save',  function(next) {
//     const user = this;

//     if (!user.isModified('password')) return next();

//     bcrypt.genSalt(10, function(err, salt) {
//         if (err) return next(err);

//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);

//             user.password = hash;
//             next();
//         });
//     });
// });


// UserSchema.methods.comparePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

// UserSchema.methods.generateJWT = function() {
//     const today = new Date();
//     const expirationDate = new Date(today);
//     expirationDate.setDate(today.getDate() + 60);

//     let payload = {
//         id: this._id,
//         email: this.email,
//     };

//     return jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
//     });
// };

UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};




module.exports = mongoose.model('User', UserSchema);