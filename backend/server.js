const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enquiry', require('./routes/enquiry'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Navbodh API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🌿 Navbodh server running on port ${PORT}`));
