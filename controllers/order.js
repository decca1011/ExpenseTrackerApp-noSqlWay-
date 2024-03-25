// const Razorpay = require('razorpay');
// const Order = require('../models/orders');
// const User = require('../models/userData');
// require('dotenv').config();

// const purchase_premium = async (req, res) => {
//   try {
//     const rzp = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     const amount = 2500;

//     rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
//       if (err) {
//         console.error('Razorpay API Error:', err);
//         return res.status(401).json({ error: 'Razorpay authentication failed' });
//       }

//       try {
//         const createdOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

//         // Update the user's premium status and order in parallel
//         await Promise.all([
//           createdOrder,
//           req.user.update({ isPremiumUser: true }),
//         ]);

//         return res.status(201).json({ order, key_id: rzp.key_id, order_id: order.id });
//       } catch (err) {
//         console.error(err);
//         return res.status(403).json({ message: 'Something went wrong', error: err });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({ message: 'Something went wrong', error: err });
//   }
// };

// const updateTransactionStatus = async (req, res, next) => {
//    try {
//     console.log(req.body)
//      const { paymentId, order_id, status } = req.body;
//      let transactionMessage;
//      let transactionSuccess;
//   //   console.log(req.user)
//  console.log(req.user.id)
//  console.log(req.body)
//      if (status === 'FAILED') {
//        transactionMessage = 'Transaction failed';
//        transactionSuccess = false;
//      } else {
//        transactionMessage = 'Transaction Successful';
//        transactionSuccess = true;
//      }
 
//      const order = await Order.findOne({ where: { orderid: order_id } });
//      const user = await User.findByPk(req.user.id);
 
     
//      const Promise1 = await order.update({ paymentid: paymentId, status: status })
//      const Promise2 = await user.update({ isUserPremeuim: transactionSuccess })

//     Promise.all([Promise1,Promise2]).then((result) => {

//       console.log(transactionMessage, '=> Transaction ID:', paymentId, result);
//       return res.status(202).json({ success: transactionSuccess, message: transactionMessage });

//     }).catch(err =>{
//       console.error(err);

//     })
 
    
//    } catch (err) {
//      console.error(err);
//      return res.status(500).json({ success: false, message: 'Internal server error' });
//    }
//  };
  
//  module.exports = {
//    purchase_premium,
//  updateTransactionStatus
//  };