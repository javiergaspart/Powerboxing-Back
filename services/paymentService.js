const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount) => {
    try {
      console.log('Creating order with amount:', amount);
  
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };
  
      const order = await razorpayInstance.orders.create(options);
      console.log('Order created:', order);
  
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };
  

  const verifyPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
  
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', razorpay_signature);
  
    return expectedSignature === razorpay_signature;
  };

module.exports = {
  createOrder,
  verifyPayment,
};
