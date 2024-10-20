const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require("./routes/shop/address-routes");
const axios = require('axios');

mongoose
  .connect("mongodb+srv://aryankarki984:aryanjungkarki2024@cluster0.p8kcr.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  method: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ["Content-Type", 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);

// Payment initiation route
app.post("/api/shop/order/create", async (req, res) => {
  const { userId, cartItems, addressInfo, totalAmount } = req.body;

  const orderId = `ORD-${Date.now()}`;
  const paymentDetails = {
    amt: totalAmount,
    pid: orderId,
    scd: "EPAYTEST", // Merchant ID/Service Code
    su: "http://localhost:5000/api/payment/success", // Success URL
    fu: "http://localhost:5000/api/payment/failure", // Failure URL
    secret_key: "8gBm/:&EnhH.1/q", // Secret Key for Epay-v2
    client_id: "JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R", // Client ID
    client_secret: "BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==" // Client Secret
  };

  // Here, you would typically use the secret key, client ID, and client secret 
  // to authenticate the payment request with eSewa's SDK.
  
  // For testing purpose, assume we are creating a payment URL
  const esewaPaymentURL = `https://uat.esewa.com.np/epay/main?amt=${paymentDetails.amt}&pid=${paymentDetails.pid}&scd=${paymentDetails.scd}&su=${paymentDetails.su}&fu=${paymentDetails.fu}`;

  return res.json({ success: true, approvalURL: esewaPaymentURL });
});

// Payment success and failure handling
app.post('/api/payment/success', (req, res) => {
  // Handle payment success
  res.send("Payment was successful!");
});

app.post('/api/payment/failure', (req, res) => {
  // Handle payment failure
  res.send("Payment failed!");
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
