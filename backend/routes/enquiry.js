const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { name, phone, product, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    if (process.env.EMAIL_USER) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `🌿 New Enquiry from ${name} - Navbodh`,
        html: `<h2>New Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Product:</strong> ${product || 'Not specified'}</p>
          <p><strong>Message:</strong> ${message || 'No message'}</p>
        `
      });
    }
    res.json({ success: true, message: 'Enquiry submitted successfully! We\'ll contact you soon.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
