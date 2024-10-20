// server/controllers/paymentController.js
const { createEsewaPayment } = require('../helpers/esewa');

exports.processPayment = async (req, res) => {
    const { amount, orderId } = req.body;

    try {
        const response = await createEsewaPayment(amount, orderId);
        res.redirect(response); // Redirect to eSewa for payment
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment creation failed', error });
    }
};

// Handle success and failure routes
exports.successPayment = (req, res) => {
    // Logic to handle successful payment
    res.send('Payment successful!'); // Customize as needed
};

exports.failurePayment = (req, res) => {
    // Logic to handle failed payment
    res.send('Payment failed! Please try again.'); // Customize as needed
};
