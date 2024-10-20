const Order = require("../../models/Order"); // Adjust the path as necessary

const createOrder = async (req, res) => {
  try {
    const orderData = {
      userId: req.body.userId,
      cartItems: req.body.cartItems,
      addressInfo: req.body.addressInfo,
      orderStatus: req.body.orderStatus,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      totalAmount: req.body.totalAmount,
      orderDate: req.body.orderDate,
      orderUpdateDate: req.body.orderUpdateDate,
      paymentId: null,
      payerId: null,
    };

    const newlyCreatedOrder = new Order(orderData);
    await newlyCreatedOrder.save();

    // Prepare eSewa payment URL
    const approvalURL = `https://esewa.com.np/epay/main?amt=${req.body.totalAmount}&txAmt=0&psc=0&pid=${newlyCreatedOrder._id}&su=http://localhost:5173/shop/esewa-return&fu=http://localhost:5173/shop/esewa-cancel`;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const captureEsewaPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body; // eSewa will redirect here with parameters
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status, paymentId, etc.
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId; // eSewa's payment ID
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed",
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  captureEsewaPayment,
};
