const paymentService = require('../services/paymentService');

const createOrder = async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await paymentService.createOrder(amount);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Order creation failed');
  }
};

const verifyPayment = (req, res) => {
  const isValid = paymentService.verifyPayment(req.body);

  if (isValid) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
