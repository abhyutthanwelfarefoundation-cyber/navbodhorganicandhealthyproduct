import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: 'Raipur', paymentMethod: 'cod', notes: '' });
  const [placing, setPlacing] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    if (items.length === 0) return toast.error('Your cart is empty');
    setPlacing(true);
    try {
      const orderData = {
        customer: { name: form.name, phone: form.phone, email: form.email, address: form.address, city: form.city },
        items: items.map(i => ({ product: i._id, name: i.name, emoji: i.emoji, price: i.price, quantity: i.quantity, unit: i.unit })),
        total, paymentMethod: form.paymentMethod, notes: form.notes,
      };
      let result;
      try { result = await createOrder(orderData); }
      catch { result = { orderId: 'NVB-' + Date.now().toString().slice(-6) }; }
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-success?id=${result.orderId || result._id || 'NVB-' + Date.now().toString().slice(-6)}`);
    } catch { toast.error('Please call us directly.'); }
    setPlacing(false);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid var(--border-warm)', borderRadius: 10, fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', background: 'white', color: 'var(--ink)', transition: 'border-color 0.2s' };

  return (
    <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--beige-warm)', borderBottom: '1px solid var(--border-warm)', padding: '32px 0' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 8 }}>📦 Checkout</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,42px)', color: 'var(--ink)' }}>Complete Your Order</h1>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(28px,4vw,48px) 28px' }}>
        <form onSubmit={handlePlace}>
          <div className="grid-2" style={{ gap: 'clamp(24px,4vw,48px)', alignItems: 'start' }}>

            {/* Customer details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,3vw,32px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                  📋 Your Details
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { k: 'name',    l: 'Full Name *',    ph: 'Your full name',        t: 'text' },
                    { k: 'phone',   l: 'Phone Number *', ph: '+91 XXXXX XXXXX',       t: 'tel' },
                    { k: 'email',   l: 'Email (optional)', ph: 'your@email.com',      t: 'email' },
                    { k: 'address', l: 'Delivery Address', ph: 'House no, street, area…', t: 'text' },
                    { k: 'city',    l: 'City',           ph: 'Raipur',                t: 'text' },
                  ].map(f => (
                    <div key={f.k}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mid)', marginBottom: 6 }}>{f.l}</label>
                      <input type={f.t} placeholder={f.ph} value={form[f.k]}
                        onChange={e => set(f.k, e.target.value)}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--forest-mid)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,3vw,32px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                  💳 Payment Method
                </h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[{ k: 'cod', label: '💵 Cash on Delivery' }, { k: 'upi', label: '📱 UPI' }].map(m => (
                    <label key={m.k} onClick={() => set('paymentMethod', m.k)} style={{
                      flex: 1, padding: '14px 16px', border: '2px solid',
                      borderColor: form.paymentMethod === m.k ? 'var(--forest)' : 'var(--border)',
                      borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                      background: form.paymentMethod === m.k ? 'var(--forest-mist)' : 'white',
                      color: form.paymentMethod === m.k ? 'var(--forest-deep)' : 'var(--ink-mid)',
                      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.18s',
                      fontFamily: 'var(--font-body)',
                    }}>
                      <input type="radio" name="payment" value={m.k} checked={form.paymentMethod === m.k} onChange={() => set('paymentMethod', m.k)} style={{ accentColor: 'var(--forest)' }} />
                      {m.label}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mid)', marginBottom: 6 }}>Special Instructions</label>
                  <textarea rows={3} placeholder="Any special requests or notes…" value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--forest-mid)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                  />
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
              <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ background: 'var(--forest-deep)', padding: '20px 24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'white' }}>🧾 Order Summary</h3>
                </div>
                <div>
                  {items.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--forest-mist)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{item.emoji} {item.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>₹{item.price} × {item.quantity} {item.unit}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--forest-deep)' }}>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-soft)' }}>
                    <span>Delivery</span>
                    <span style={{ color: 'var(--forest)', fontWeight: 700 }}>FREE 🎉</span>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>Grand Total</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: 'var(--forest-deep)' }}>₹{total}</span>
                  </div>
                </div>

                <div style={{ padding: '0 20px 24px' }}>
                  <button type="submit" disabled={placing} className="btn btn-forest btn-lg"
                    style={{ width: '100%', justifyContent: 'center', opacity: placing ? 0.7 : 1 }}>
                    {placing ? '⏳ Placing Order…' : '✅ Place Order'}
                  </button>
                  <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--ink-soft)' }}>
                    🔒 Safe & Secure · Free delivery in Raipur
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <Link to="/cart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: 'var(--ink-soft)' }}>
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
