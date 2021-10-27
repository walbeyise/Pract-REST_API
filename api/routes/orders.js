const express = require('express');
const router = express.Router();
const Auth = require('../auth/auth')
const OrdersController = require('../controllers/order')
const { userAuth, checkRole } = require('../utils/Auth')

router.get('/', userAuth,  checkRole(['user']), OrdersController.orders_get_all)

router.post('/', Auth, OrdersController.orders_create_order)

router.get('/:orderId', Auth, OrdersController.orders_get_single_order)

router.delete('/:orderId', Auth, OrdersController.orders_delete_order)


module.exports = router;