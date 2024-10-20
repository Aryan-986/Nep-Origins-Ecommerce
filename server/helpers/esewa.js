// server/helpers/esewa.js
const axios = require('axios');
const crypto = require('crypto');

// eSewa API credentials
const ESewaCredentials = {
    MERCHANT_ID: 'EPAYTEST',
    TOKEN: '123456',
    PAYMENT_URL: 'https://uat.esewa.com.np/epay/main',  // Sandbox environment for testing
    SUCCESS_URL: 'http://localhost:5000/api/payment/success',
    FAILURE_URL: 'http://localhost:5000/api/payment/failure'
};

// Function to handle eSewa payment
exports.initiatePayment = async (amount, orderId) => {
    try {
        // Create a secure hash for eSewa
        const hashString = `${ESewaCredentials.MERCHANT_ID}:${amount}:${orderId}:${ESewaCredentials.TOKEN}`;
        const hash = crypto.createHash('md5').update(hashString).digest('hex');

        // Prepare data for eSewa payment
        const paymentData = {
            amt: amount,
            psc: 0, // Service charge (optional)
            pdc: 0, // Delivery charge (optional)
            tAmt: amount,  // Total amount
            pid: orderId,
            scd: ESewaCredentials.MERCHANT_ID,
            su: ESewaCredentials.SUCCESS_URL,
            fu: ESewaCredentials.FAILURE_URL,
        };

        // Redirect the user to eSewa payment page
        const paymentUrl = `${ESewaCredentials.PAYMENT_URL}?amt=${paymentData.amt}&psc=${paymentData.psc}&pdc=${paymentData.pdc}&tAmt=${paymentData.tAmt}&pid=${paymentData.pid}&scd=${paymentData.scd}&su=${paymentData.su}&fu=${paymentData.fu}`;
        
        return paymentUrl;  // Return the URL so that the user can be redirected to it
    } catch (error) {
        throw new Error(`eSewa payment initiation failed: ${error.message}`);
    }
};

// Function to verify the payment success (optional)
exports.verifyPayment = async (orderId, refId) => {
    try {
        const verificationData = {
            amt: amount,
            rid: refId,
            pid: orderId,
            scd: ESewaCredentials.MERCHANT_ID,
        };

        const response = await axios.post('https://uat.esewa.com.np/epay/transrec', verificationData);
        return response.data;
    } catch (error) {
        throw new Error(`Payment verification failed: ${error.message}`);
    }
};
