const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// POST create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Send confirmation email (optional)
    try {
      if (process.env.EMAIL_USER) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `🌿 New Order #${order._id.toString().slice(-6).toUpperCase()} - Navbodh`,
          html: `<h2>New Order Received!</h2>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Items:</strong> ${order.items.map(i => `${i.emoji} ${i.name} x${i.quantity}`).join(', ')}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
          `
        });
      }
    } catch (emailErr) {
      console.log('Email not sent:', emailErr.message);
    }

    res.status(201).json({ success: true, orderId: order._id, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
