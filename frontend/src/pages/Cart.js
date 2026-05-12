import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../components/ProductCard';

const Cart = () => {
  const { items, total, dispatch } = useCart();

  if (items.length === 0) return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: 'var(--cream)' }}>
      <div style={{ fontSize: 72, animation: 'float 3s infinite' }}>🛒</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--ink)' }}>Your cart is empty</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 16 }}>Add some organic goodness to get started!</p>
      <Link to="/products" className="btn btn-forest btn-lg">Browse Products</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--cream)', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--beige-warm)', borderBottom: '1px solid var(--border-warm)', padding: '32px 0' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 8 }}>🛒 Shopping</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,44px)', color: 'var(--ink)' }}>Your Cart</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6, fontSize: 14 }}>{items.reduce((s, i) => s + i.quantity, 0)} items</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(28px,4vw,48px) 28px' }}>
        <div className="grid-2" style={{ gap: 'clamp(24px,4vw,48px)', alignItems: 'start' }}>

          {/* Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map(item => (
              <div key={item._id} style={{ background: 'white', borderRadius: 16, padding: 'clamp(14px,2vw,20px)', border: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                {/* Image */}
                <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={getProductImage(item)} alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=70'; }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(15px,1.6vw,18px)', color: 'var(--ink)', marginBottom: 2 }}>
                    {item.emoji} {item.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>₹{item.price} per {item.unit}</div>
                </div>
                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <button onClick={() => item.quantity > 1 ? dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.quantity - 1 } }) : dispatch({ type: 'REMOVE_ITEM', payload: item._id })}
                      style={{ width: 36, height: 36, background: 'var(--cream)', fontSize: 17, cursor: 'pointer', border: 'none', color: 'var(--ink)', transition: 'background 0.15s' }}>−</button>
                    <span style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, background: 'white' }}>{item.quantity}</span>
                    <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.quantity + 1 } })}
                      style={{ width: 36, height: 36, background: 'var(--cream)', fontSize: 17, cursor: 'pointer', border: 'none', color: 'var(--ink)', transition: 'background 0.15s' }}>+</button>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(16px,2vw,20px)', color: 'var(--forest-deep)', minWidth: 70, textAlign: 'right' }}>
                    ₹{item.price * item.quantity}
                  </div>
                  <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item._id })}
                    style={{ width: 30, height: 30, borderRadius: '50%', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ background: 'var(--beige-warm)', padding: '20px 24px', borderBottom: '1px solid var(--border-warm)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>Order Summary</h3>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {items.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: 'var(--ink-mid)' }}>
                    <span>{item.emoji} {item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 14, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-soft)' }}>
                  <span>Delivery</span>
                  <span style={{ color: 'var(--forest)', fontWeight: 700 }}>FREE 🎉</span>
                </div>
                <div style={{ borderTop: '2px solid var(--border)', paddingTop: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--forest-deep)' }}>₹{total}</span>
                </div>
                <Link to="/checkout" className="btn btn-forest btn-lg" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
                  Proceed to Checkout →
                </Link>
                <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--ink-soft)' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🔒 Secure', '🚚 Free Delivery', '🌿 Organic'].map((b, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--forest-mist)', padding: '5px 12px', borderRadius: 100, border: '1px solid var(--border)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
