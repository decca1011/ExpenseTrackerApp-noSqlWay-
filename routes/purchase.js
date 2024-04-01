 
const path = require('path');

const express = require('express');

const router = express.Router();

const Order = require('../controllers/order');

const authenticated = require('../middleware/authMiddleware')
 
router.get('/premium', authenticated.authenticate, Order.purchase_premium);
 
router.post('/updatetrans', authenticated.authenticate, Order.updateTransactionStatus);

 
module.exports = router
