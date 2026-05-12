const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['mango', 'dairy', 'fruit', 'nut', 'other'], required: true },
  emoji: { type: String },
  origin: { type: String },
  badge: { type: String },
  description: { type: String, required: true },
  price: { type: Number },
  unit: { type: String, default: 'kg' },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  image: { type: String },
  tags: [String],
}, { timestamps: true });

// Seed data method
productSchema.statics.seedData = async function() {
  const count = await this.countDocuments();
  if (count > 0) return;
  await this.insertMany(products);
  console.log('Products seeded');
};

const products = [
  { name: 'Dasheri Mango', category: 'mango', emoji: '🥭', origin: 'Uttar Pradesh', badge: 'Sweet & Fibrous', description: 'The king of mangoes from UP — intensely sweet, silky smooth, and absolutely fibrous-free. Hand-picked at perfect ripeness.', price: 180, unit: 'kg', featured: true, tags: ['bestseller', 'sweet'] },
  { name: 'Banganapalli', category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh', badge: 'Large & Juicy', description: 'Large, golden-yellow mangoes with a thin skin and rich, juicy pulp. A South Indian classic loved for its mild sweetness.', price: 160, unit: 'kg', tags: ['juicy', 'large'] },
  { name: 'Langda', category: 'mango', emoji: '🥭', origin: 'Varanasi', badge: 'Turpentine Free', description: 'The iconic green-skinned mango from Varanasi. Sweet, slightly tangy, and completely turpentine-free. A must-try.', price: 200, unit: 'kg', tags: ['tangy', 'classic'] },
  { name: 'Shafeda', category: 'mango', emoji: '🥭', origin: 'Maharashtra', badge: 'Mild & Fragrant', description: 'A Maharashtrian gem — mild sweetness, heavenly fragrance, and silky texture. Perfect for those who prefer subtlety.', price: 220, unit: 'kg', tags: ['fragrant', 'mild'] },
  { name: 'Tota Pari', category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh', badge: 'Unique Beak Shape', description: 'Named for its distinctive parrot-beak shape. Fibre-free, sweet pulp with a beautiful golden hue inside.', price: 150, unit: 'kg', tags: ['unique', 'fibrefree'] },
  { name: 'Amrapali', category: 'mango', emoji: '🥭', origin: 'All India', badge: 'Regular Bearer', description: 'A hybrid mango that fruits regularly through the season. Deep orange pulp, small seed, intensely sweet.', price: 170, unit: 'kg', featured: true, tags: ['hybrid', 'sweet'] },
  { name: 'Mallika', category: 'mango', emoji: '🥭', origin: 'Hybrid Variety', badge: 'Neelam × Dasheri', description: 'The best of two worlds — Neelam\'s aroma meets Dasheri\'s sweetness. Smooth, rich, and absolutely delicious.', price: 190, unit: 'kg', tags: ['hybrid', 'aromatic'] },
  { name: 'Pure Desi Ghee', category: 'dairy', emoji: '🧈', badge: 'A2 Quality', description: 'Hand-churned from fresh cow\'s milk using traditional bilona method. Rich aroma, golden colour, A2 quality.', price: 800, unit: '500ml', featured: true, tags: ['a2', 'bilona', 'traditional'] },
  { name: 'Fresh Milk', category: 'dairy', emoji: '🥛', badge: 'Farm Fresh', description: 'Pure, unadulterated farm-fresh milk. No preservatives, no additives — just natural goodness delivered to your door.', price: 60, unit: 'litre', tags: ['fresh', 'natural'] },
  { name: 'Jackfruit', category: 'fruit', emoji: '🍈', badge: 'Seasonal', description: 'Organic jackfruit — nature\'s meat alternative. Tender, flavourful, and packed with nutrients. Available whole or sliced.', price: 80, unit: 'kg', tags: ['seasonal', 'organic'] },
  { name: 'Fresh Lemon', category: 'fruit', emoji: '🍋', badge: 'Vitamin C', description: 'Tangy, juicy, organic lemons packed with Vitamin C. Perfect for cooking, beverages and health rituals.', price: 60, unit: 'kg', tags: ['vitamin-c', 'tangy'] },
  { name: 'Kaju (Cashews)', category: 'nut', emoji: '🌰', badge: 'Premium Grade', description: 'Premium quality whole cashews. Creamy, buttery, and rich in healthy fats. Great as a snack or in cooking.', price: 900, unit: 'kg', tags: ['premium', 'healthy-fats'] },
  { name: 'Star Fruit', category: 'fruit', emoji: '⭐', badge: 'Antioxidant Rich', description: 'Exotic tropical star fruit (carambola) — visually stunning, tangy-sweet taste, loaded with antioxidants.', price: 120, unit: 'kg', tags: ['exotic', 'antioxidant'] },
];

module.exports = mongoose.model('Product', productSchema);
