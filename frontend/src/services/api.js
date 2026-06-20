import axios from 'axios';
import emailjs from '@emailjs/browser';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

// ─── EmailJS config — from environment variables ──────────────────
const EMAILJS_SERVICE_ID       = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY       = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_ENQUIRY_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_ORDER_TEMPLATE   = process.env.REACT_APP_EMAILJS_ORDER_TEMPLATE;
// ──────────────────────────────────────────────────────────────────

export const STATIC_PRODUCTS = [
  { _id: '1', name: 'Dasheri Mango',  category: 'mango', emoji: '🥭', origin: 'Uttar Pradesh',  description: 'The king of mangoes from UP — intensely sweet, silky smooth, and absolutely fibrous-free. Hand-picked at perfect ripeness.', price: 160,  unit: 'kg',    featured: false, tags: ['bestseller', 'sweet'],    inStock: false },
  { _id: '2', name: 'Langda',         category: 'mango', emoji: '🥭', origin: 'Varanasi',        description: 'The iconic green-skinned mango from Varanasi. Sweet, slightly tangy, and completely turpentine-free. A must-try.',           price: 160,  unit: 'kg',    featured: false, tags: ['tangy', 'classic'],        inStock: false },
  { _id: '3', name: 'Banganapalli',   category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh',  description: 'Large, golden-yellow mangoes with a thin skin and rich, juicy pulp. A South Indian classic loved for its mild sweetness.',    price: 120,  unit: 'kg',    featured: false, tags: ['juicy', 'large'],          inStock: true  },
  { _id: '4', name: 'Shafeda',        category: 'mango', emoji: '🥭', origin: 'Maharashtra',     description: 'A Maharashtrian gem — mild sweetness, heavenly fragrance, and silky texture. Perfect for those who prefer subtlety.',        price: 160,  unit: 'kg',    featured: false, tags: ['fragrant', 'mild'],        inStock: false },
  { _id: '5', name: 'Tota Pari',      category: 'mango', emoji: '🥭', origin: 'Andhra Pradesh',  description: 'Named for its distinctive parrot-beak shape. Fibre-free, sweet pulp with a beautiful golden hue inside.',                    price: 160,  unit: 'kg',    featured: false, tags: ['unique', 'fibrefree'],     inStock: false },
  { _id: '6', name: 'Amrapali',       category: 'mango', emoji: '🥭', origin: 'All India',       description: 'A hybrid mango that fruits regularly through the season. Deep orange pulp, small seed, intensely sweet.',                     price: 160,  unit: 'kg',    featured: false, tags: ['hybrid', 'sweet'],         inStock: false },
  { _id: '7', name: 'Mallika',        category: 'mango', emoji: '🥭', origin: 'Hybrid Variety',  description: "The best of two worlds — Neelam's aroma meets Dasheri's sweetness. Smooth, rich, and absolutely delicious.",                price: 160,  unit: 'kg',    featured: false, tags: ['hybrid', 'aromatic'],      inStock: false },
  { _id: '8', name: 'Pure Desi Ghee', category: 'dairy', emoji: '🧈', origin: 'Raipur, CG',     description: "Hand-churned from fresh cow's milk using traditional bilona method. Rich aroma, golden colour, A2 quality.",                price: 1500, unit: '500ml', featured: true,  tags: ['a2', 'bilona', 'traditional'], inStock: true, badge: 'A2 Quality' },
  { _id: '10', name: 'Jackfruit',     category: 'fruit', emoji: '🍈', origin: 'Raipur, CG',     description: "Organic jackfruit — nature's meat alternative. Tender, flavourful, and packed with nutrients. Available whole or sliced.",    price: 80,   unit: 'kg',    featured: false, tags: ['seasonal', 'organic'],     inStock: false },
  { _id: '11', name: 'Fresh Lemon',   category: 'fruit', emoji: '🍋', origin: 'Raipur, CG',     description: 'Tangy, juicy, organic lemons packed with Vitamin C. Perfect for cooking, beverages and health rituals.',                     price: 60,   unit: 'kg',    featured: false, tags: ['vitamin-c', 'tangy'],      inStock: false },
  { _id: '12', name: 'Kaju (Cashews)',category: 'nut',   emoji: '🌰', origin: 'Raipur, CG',     description: 'Premium quality whole cashews. Creamy, buttery, and rich in healthy fats. Great as a snack or in cooking.',                  price: 900,  unit: 'kg',    featured: false, tags: ['premium', 'healthy-fats'], inStock: false },
  { _id: '13', name: 'Star Fruit',    category: 'fruit', emoji: '⭐', origin: 'Raipur, CG',     description: 'Exotic tropical star fruit (carambola) — visually stunning, tangy-sweet taste, loaded with antioxidants.',                   price: 120,  unit: 'kg',    featured: false, tags: ['exotic', 'antioxidant'],   inStock: false },
];

export const getProducts = async (params = {}) => {
  try {
    const res = await API.get('/products', { params });
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
    if (!res.data || !res.data.name) throw new Error('incomplete');
    return res.data;
  } catch {
    return STATIC_PRODUCTS.find(p => p._id === id);
  }
};

// ── Create order + send email notification ──────────────────────
export const createOrder = async (orderData) => {
  const orderId = 'NVB-' + Date.now().toString().slice(-6);
  try {
    const res = await API.post('/orders', orderData);
    if (res.data) {
      await sendOrderEmail(orderData, res.data._id || res.data.orderId || orderId);
      return res.data;
    }
  } catch {
    // Backend failed — fallback
  }
  await sendOrderEmail(orderData, orderId);
  return { orderId };
};

// ── Send order email via EmailJS ────────────────────────────────
const sendOrderEmail = async (orderData, orderId) => {
  try {
    const itemsList = orderData.items
      .map(i => `${i.emoji || ''} ${i.name} × ${i.quantity} ${i.unit} = ₹${i.price * i.quantity}`)
      .join('\n');

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORDER_TEMPLATE,
      {
        order_id:       orderId,
        customer_name:  orderData.customer.name,
        phone:          orderData.customer.phone,
        address:        `${orderData.customer.address || '—'}, ${orderData.customer.city || 'Raipur'}`,
        items:          itemsList,
        total:          orderData.total,
        payment_method: orderData.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 UPI Payment',
        txn_id:         orderData.txnId || '—',
        notes:          orderData.notes || '—',
      },
      EMAILJS_PUBLIC_KEY,
    );
  } catch (err) {
    console.warn('Order email failed:', err);
  }
};

// ── Enquiry form ────────────────────────────────────────────────
export const submitEnquiry = async (data) => {
  const result = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_ENQUIRY_TEMPLATE,
    {
      name:    data.name,
      phone:   data.phone,
      email:   data.email   || '—',
      product: data.product || '—',
      message: data.message || '—',
    },
    EMAILJS_PUBLIC_KEY,
  );
  if (result.status !== 200) throw new Error('EmailJS failed');
  return { success: true };
};

export default API;