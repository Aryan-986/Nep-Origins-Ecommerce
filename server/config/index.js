// server/config/esewaConfig.js
module.exports = {
    merchantId: 'EPAYTEST', // Replace with your eSewa Merchant ID
    secretKey: 'Nepal@123', // Your eSewa Password
    successUrl: 'http://localhost:5000/api/payment/success', // Success URL
    failureUrl: 'http://localhost:5000/api/payment/failure', // Failure URL
    eSewaUrl: 'https://uat.esewa.com.np/epay/main', // eSewa URL for testing
};
