const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// POST create order
router.post('/', async (req, res) => {
  try {
    console.log('ORDER RECEIVED:', JSON.stringify(req.body, null, 2));
    const order = new Order(req.body);
    await order.save();
    console.log('ORDER SAVED:', order._id);

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
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
    console.error('ORDER ERROR:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET stats (admin dashboard)
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalOrders, todayOrders, pendingOrders, revenueResult] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ status: { $in: ['placed', 'confirmed', 'packed', 'dispatched'] } }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
    ]);

    res.json({
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue: revenueResult[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all orders — supports ?status=&limit=
router.get('/', async (req, res) => {
  try {
    const { status, limit } = req.query;
    const filter = status ? { status } : {};
    const query = Order.find(filter).sort({ createdAt: -1 });
    if (limit) query.limit(parseInt(limit));
    const orders = await query;
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;