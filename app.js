const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')
const passport = require('passport')


mongoose.connect('mongodb://localhost:27017/Shop-Rest-Api',
{ useUnifiedTopology: true },
{ useNewUrlParser: true },
{useCreateIndex: true,
useFindAndModify: false }
).then(()=> console.log('Db Connected!'))
.catch(err =>{
    console.log(`DB Connection Error: ${err}`);
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(passport.initialize());

require('./api/middlewares/passport')(passport);
//cors origin
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization' 
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({})
    }
    next();
})

//Routes handling requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes)

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status= 404;
    next(error);
})

app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;