const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user');
require('dotenv').config();

const purchase_premium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        console.error('Razorpay API Error:', err);
        return res.status(401).json({ error: 'Razorpay authentication failed' });
      }

      try {
        const newOrder = new Order({ orderid: order.id, status: 'PENDING' });
        const savedOrder = await newOrder.save();

       

        return res.status(201).json({ order: savedOrder, key_id: rzp.key_id, order_id: order.id });
      } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Something went wrong', error: err });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};

const updateTransactionStatus = async (req, res, next) => {
  console.log('hello');
  try {
    const { paymentId, order_id, status } = req.body;
    let transactionMessage;
    let transactionSuccess;

    if (status === 'FAILED') {
      transactionMessage = 'Transaction failed';
      transactionSuccess = false;
    } else {
      transactionMessage = 'Transaction Successful';
      transactionSuccess = true;
    }

    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderid: order_id },
      { $set: { paymentid: paymentId, status: status } },
      { new: true }
    );
await order.save()
    console.log(transactionMessage, '=> Transaction ID:', paymentId);
    // Update user premium status if transaction was successful
    if (transactionSuccess) {
      const userId = req.user._id; // Assuming req.user is populated by middleware with the current user
      const user = await User.findById(userId)
      console.log(user)
      user.isPremium = true;
      await user.save();


    }

    return res.status(202).json({ success: transactionSuccess, message: transactionMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

  
 module.exports = {
   purchase_premium,
   updateTransactionStatus
 };



 