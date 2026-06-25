const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.Mixed }, // accepts ObjectId or string or null
  name: String,
  emoji: String,
  price: Number,
  quantity: Number,
  unit: String,
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String,
    city: { type: String, default: 'Raipur' },
  },
  items: [orderItemSchema],
  total: Number,
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentMethod: { type: String, enum: ['cod', 'upi', 'online'], default: 'cod' },
  paymentStatus: { type: String, default: 'pending' },
  txnId: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);