// src/controllers/paymentController.js

const axios = require('axios');

const createPayment = async (req, res) => {
    const { userId, slotId } = req.body; // Get user and slot information
    const paymentAmount = 500; // Payment amount in INR

    try {
        const response = await axios.post('https://books.zoho.com/api/v3/payment', {
            amount: paymentAmount,
            currency: 'INR',
            // Add other required parameters here
        }, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`, // Use your Zoho API token
                'Content-Type': 'application/json',
            },
        });

        // Redirect user to the payment URL
        res.status(200).json({ paymentUrl: response.data.payment_url });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
};

const paymentSuccess = async (req, res) => {
    // Logic to handle successful payment notification
    // Update slot booking status in your database
    res.status(200).json({ message: 'Payment processed successfully' });
};

module.exports = {
    createPayment,
    paymentSuccess,
};
