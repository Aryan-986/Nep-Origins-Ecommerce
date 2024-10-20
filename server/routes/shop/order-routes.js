const express = require('express');
const { createOrder, captureEsewaPayment } = require('../controllers/order-controller');
const router = express.Router();

router.post("/create", createOrder); // Endpoint to create order
router.post("/capture-esewa", captureEsewaPayment); // New endpoint for eSewa payment confirmation
router.get("/esewa-return", async (req, res) => {
    const { paymentId, orderId } = req.query; // Get paymentId and orderId from the query params
    // Call the capture payment logic
    const result = await captureEsewaPayment({ body: { paymentId, orderId } }); // Simulating capture logic
    res.redirect("http://localhost:5173/shop/confirmation"); // Redirect to a confirmation page
  });
  router.get("/esewa-cancel", (req, res) => {
    res.redirect("http://localhost:5173/shop/cancel"); // Redirect to a cancellation page
  });
  

module.exports = router;
