const express = require('express');
const router = express.Router();
const { userAuth, checkRole } = require('../utils/Auth');
const ProductsController = require('../controllers/products');
const multer = require('multer');
const Auth = require('../auth/auth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else{
        cb(null, false)
    }
}

const upload = multer({storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', userAuth, checkRole(['admin']), ProductsController.products_get_all)

router.post('/', userAuth, upload.single('productImage'), ProductsController.products_create_product)

router.get('/:productId', ProductsController.products_get_single_product)
 
router.patch('/:productId', userAuth, ProductsController.update_product)

router.delete('/:productId', userAuth,  ProductsController.product_delete)




module.exports = router;