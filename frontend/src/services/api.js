import axios from 'axios';
import emailjs from '@emailjs/browser';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

// ─── EmailJS config ───────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_n7gjyhg';
const EMAILJS_TEMPLATE_ID = 'template_xq48lbh';
const EMAILJS_PUBLIC_KEY  = 'rAeYi3QJMOORI1p4U';
// ──────────────────────────────────────────────────────────────────

export const STATIC_PRODUCTS = [
  { _id: '1', name: 'Dasheri Mango', category: 'mango', emoji: '🥭', origin: 'Uttar Pradesh', badge: 'Sweet & Fibrous', description: 'The king of mangoes from UP — intensely sweet, silky smooth, and absolutely fibrous-free. Hand-picked at perfect ripeness.', price: 180, unit: 'kg', featured: true, tags: ['bestseller', 'sweet'], inStock: true },
  { _id: '2', name: 'Banganapalli', category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh', badge: 'Large & Juicy', description: 'Large, golden-yellow mangoes with a thin skin and rich, juicy pulp. A South Indian classic loved for its mild sweetness.', price: 180, unit: 'kg', tags: ['juicy', 'large'], inStock: true },
  { _id: '3', name: 'Langda', category: 'mango', emoji: '🥭', origin: 'Varanasi', badge: 'Turpentine Free', description: 'The iconic green-skinned mango from Varanasi. Sweet, slightly tangy, and completely turpentine-free. A must-try.', price: 180, unit: 'kg', tags: ['tangy', 'classic'], inStock: true },
  { _id: '4', name: 'Shafeda', category: 'mango', emoji: '🥭', origin: 'Maharashtra', badge: 'Mild & Fragrant', description: 'A Maharashtrian gem — mild sweetness, heavenly fragrance, and silky texture. Perfect for those who prefer subtlety.', price: 180, unit: 'kg', tags: ['fragrant', 'mild'], inStock: true },
  { _id: '5', name: 'Tota Pari', category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh', badge: 'Unique Beak Shape', description: 'Named for its distinctive parrot-beak shape. Fibre-free, sweet pulp with a beautiful golden hue inside.', price: 180, unit: 'kg', tags: ['unique', 'fibrefree'], inStock: true },
  { _id: '6', name: 'Amrapali', category: 'mango', emoji: '🥭', origin: 'All India', badge: 'Regular Bearer', description: 'A hybrid mango that fruits regularly through the season. Deep orange pulp, small seed, intensely sweet.', price: 180, unit: 'kg', featured: true, tags: ['hybrid', 'sweet'], inStock: true },
  { _id: '7', name: 'Mallika', category: 'mango', emoji: '🥭', origin: 'Hybrid Variety', badge: 'Neelam × Dasheri', description: "The best of two worlds — Neelam's aroma meets Dasheri's sweetness. Smooth, rich, and absolutely delicious.", price: 180, unit: 'kg', tags: ['hybrid', 'aromatic'], inStock: true },
  { _id: '8', name: 'Pure Desi Ghee', category: 'dairy', emoji: '🧈', badge: 'A2 Quality', description: "Hand-churned from fresh cow's milk using traditional bilona method. Rich aroma, golden colour, A2 quality.", price: 1500, unit: '500ml', featured: true, tags: ['a2', 'bilona', 'traditional'], inStock: true },
  { _id: '9', name: 'Fresh Milk', category: 'dairy', emoji: '🥛', badge: 'Farm Fresh', description: 'Pure, unadulterated farm-fresh milk. No preservatives, no additives — just natural goodness delivered to your door.', price: 60, unit: 'litre', tags: ['fresh', 'natural'], inStock: true },
  { _id: '10', name: 'Jackfruit', category: 'fruit', emoji: '🍈', badge: 'Seasonal', description: "Organic jackfruit — nature's meat alternative. Tender, flavourful, and packed with nutrients. Available whole or sliced.", price: 80, unit: 'kg', tags: ['seasonal', 'organic'], inStock: true },
  { _id: '11', name: 'Fresh Lemon', category: 'fruit', emoji: '🍋', badge: 'Vitamin C', description: 'Tangy, juicy, organic lemons packed with Vitamin C. Perfect for cooking, beverages and health rituals.', price: 60, unit: 'kg', tags: ['vitamin-c', 'tangy'], inStock: true },
  { _id: '12', name: 'Kaju (Cashews)', category: 'nut', emoji: '🌰', badge: 'Premium Grade', description: 'Premium quality whole cashews. Creamy, buttery, and rich in healthy fats. Great as a snack or in cooking.', price: 900, unit: 'kg', tags: ['premium', 'healthy-fats'], inStock: true },
  { _id: '13', name: 'Star Fruit', category: 'fruit', emoji: '⭐', badge: 'Antioxidant Rich', description: 'Exotic tropical star fruit (carambola) — visually stunning, tangy-sweet taste, loaded with antioxidants.', price: 120, unit: 'kg', tags: ['exotic', 'antioxidant'], inStock: true },
];

export const getProducts = async (params = {}) => {
  try {
    const res = await API.get('/products', { params });
    // If backend returns empty or broken, use static
    if (!res.data || res.data.length === 0) throw new Error('empty');
    return res.data;
  } catch {
    let data = STATIC_PRODUCTS;
    if (params.category) data = data.filter(p => p.category === params.category);
    if (params.featured)  data = data.filter(p => p.featured);
    return data;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    // Backend returns MongoDB doc — check it has a name
    if (!res.data || !res.data.name) throw new Error('incomplete');
    return res.data;
  } catch {
    // Always fall back to static data using simple _id match
    return STATIC_PRODUCTS.find(p => p._id === id);
  }
};  

export const createOrder = async (orderData) => {
  const res = await API.post('/orders', orderData);
  return res.data;
};

// ── Sends directly via EmailJS, skips backend ──
export const submitEnquiry = async (data) => {
  const result = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name:    data.name,
      phone:   data.phone,
      email:   data.email  || '—',   // ← only change: email added
      product: data.product || '—',
      message: data.message || '—',
    },
    EMAILJS_PUBLIC_KEY,
  );
  if (result.status !== 200) throw new Error('EmailJS failed');
  return { success: true };
};

export default API;