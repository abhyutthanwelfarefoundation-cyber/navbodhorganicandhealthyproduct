const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
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
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'upi', 'online'], default: 'cod' },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
