import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../components/ProductCard';
import { MdArrowForward } from 'react-icons/md';
import { IoLeafOutline } from 'react-icons/io5';
import { GiMango } from 'react-icons/gi';
import { TbShoppingCart } from 'react-icons/tb';

const fadeUp = {
  hidden:  { opacity:0, y:24 },
  visible: { opacity:1, y:0, transition:{ duration:0.5, ease:[0.34,1.2,0.64,1] } },
};
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } };

const Cart = () => {
  const { items, total, dispatch } = useCart();

  /* ── Empty state ── */
  if (items.length === 0) return (
    <div style={{ paddingTop:'var(--nav-h)', minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, background:'var(--cream)', padding:'var(--nav-h) 24px 60px' }}>
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:14 }}>
        <TbShoppingCart size={72} color="var(--border)" />
      </motion.div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,4vw,32px)', color:'var(--ink)', textAlign:'center' }}>Your cart is empty</h2>
      <p style={{ color:'var(--ink-soft)', fontSize:16, textAlign:'center' }}>Add some organic goodness to get started!</p>
      <Link to="/products" className="btn btn-forest btn-lg"
        style={{ display:'flex', alignItems:'center', gap:9 }}>
        <IoLeafOutline size={17} /> Browse Products
      </Link>
    </div>
  );

  return (
    <div style={{ paddingTop:'var(--nav-h)', background:'var(--cream)', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ background:'var(--beige-warm)', borderBottom:'1px solid var(--border-warm)', padding:'clamp(28px,4vw,40px) 0' }}>
        <div className="container">
          <span className="eyebrow" style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
            <TbShoppingCart size={13} /> Shopping
          </span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,44px)', color:'var(--ink)' }}>
            Your Cart
          </h1>
          <p style={{ color:'var(--ink-soft)', marginTop:6, fontSize:14 }}>
            {items.reduce((s,i) => s + i.quantity, 0)} item{items.reduce((s,i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'clamp(24px,4vw,48px) 28px' }}>
        {/*
          On desktop:  2-col (items left, summary right)
          On mobile:   1-col stacked (items first, summary below)
        */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap:'clamp(20px,4vw,48px)',
          alignItems:'start',
        }}>

          {/* ── Cart items ── */}
          <motion.div variants={stagger} initial="hidden" animate="visible"
            style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {items.map(item => {
              const img = getProductImage(item);
              return (
                <motion.div key={item._id} variants={fadeUp}
                  style={{
                    background:'white', borderRadius:16,
                    border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)',
                    overflow:'hidden',
                  }}>
                  {/*
                    ROW LAYOUT:
                    [image] [name + unit price]
                    ─────────────────────────────
                    [qty control]    [total] [x]

                    This two-row approach avoids all overlapping on mobile.
                  */}

                  {/* Row 1: image + name */}
                  <div style={{ display:'flex', gap:14, alignItems:'center', padding:'14px 16px 10px' }}>
                    {/* Image */}
                    <div style={{ width:70, height:70, borderRadius:12, overflow:'hidden', flexShrink:0, border:'1px solid var(--border)' }}>
                      <img src={img} alt={item.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                        onError={e => { e.target.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=70'; }}
                      />
                    </div>

                    {/* Name + unit price */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'clamp(15px,1.6vw,18px)', color:'var(--ink)', lineHeight:1.25,
                        /* prevent long names from overflowing */
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize:12, color:'var(--ink-soft)', marginTop:3 }}>
                        ₹{item.price} per {item.unit}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: qty + line total + remove */}
                  <div style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    gap:10, padding:'10px 16px 14px',
                    borderTop:'1px solid var(--forest-mist)',
                    flexWrap:'wrap',
                  }}>
                    {/* Qty control */}
                    <div style={{ display:'flex', alignItems:'center', border:'1.5px solid var(--border)', borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                      <button
                        onClick={() => item.quantity > 1
                          ? dispatch({ type:'UPDATE_QTY', payload:{ id:item._id, qty:item.quantity - 1 } })
                          : dispatch({ type:'REMOVE_ITEM', payload:item._id })}
                        style={{ width:36, height:36, background:'var(--cream)', border:'none', fontSize:18, cursor:'pointer', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}
                        onMouseEnter={e => e.target.style.background='var(--forest-mist)'}
                        onMouseLeave={e => e.target.style.background='var(--cream)'}>
                        −
                      </button>
                      <span style={{ minWidth:36, textAlign:'center', fontWeight:700, fontSize:15, background:'white', height:36, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch({ type:'UPDATE_QTY', payload:{ id:item._id, qty:item.quantity + 1 } })}
                        style={{ width:36, height:36, background:'var(--cream)', border:'none', fontSize:18, cursor:'pointer', color:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }}
                        onMouseEnter={e => e.target.style.background='var(--forest-mist)'}
                        onMouseLeave={e => e.target.style.background='var(--cream)'}>
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(18px,2vw,22px)', color:'var(--forest-deep)' }}>
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => dispatch({ type:'REMOVE_ITEM', payload:item._id })}
                      style={{
                        width:32, height:32, borderRadius:'50%',
                        background:'#fef2f2', border:'1px solid #fecaca',
                        color:'#dc2626', cursor:'pointer', fontSize:15,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        transition:'all 0.2s', flexShrink:0,
                      }}
                      onMouseEnter={e => { e.target.style.background='#dc2626'; e.target.style.color='white'; }}
                      onMouseLeave={e => { e.target.style.background='#fef2f2'; e.target.style.color='#dc2626'; }}>
                      ✕
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Order Summary ── */}
          <motion.div
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.5 }}
            style={{
              /* sticky on desktop, normal flow on mobile */
              position:'sticky',
              top:'calc(var(--nav-h) + 16px)',
            }}>
            <div style={{ background:'white', borderRadius:20, border:'1px solid var(--border)', overflow:'hidden', boxShadow:'var(--shadow-md)' }}>

              {/* Summary header */}
              <div style={{ background:'var(--forest-deep)', padding:'18px 22px' }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, color:'white' }}>
                  Order Summary
                </h3>
              </div>

              {/* Items list */}
              <div style={{ padding:'4px 0' }}>
                {items.map(item => (
                  <div key={item._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', borderBottom:'1px solid var(--forest-mist)', gap:8 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize:11, color:'var(--ink-soft)', marginTop:1 }}>
                        ₹{item.price} × {item.quantity} {item.unit}
                      </div>
                    </div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--forest-deep)', flexShrink:0 }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding:'16px 20px' }}>
                {/* Delivery */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:'var(--ink-soft)' }}>
                  <span>Delivery</span>
                  <span style={{ color:'var(--forest)', fontWeight:700 }}>Depends On Distance</span>
                </div>

                {/* Total */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderTop:'2px solid var(--border)', paddingTop:14, marginTop:6 }}>
                  <span style={{ fontWeight:700, fontSize:17, color:'var(--ink)' }}>Total</span>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(28px,3.5vw,36px)', color:'var(--forest-deep)' }}>
                    ₹{total}
                  </span>
                </div>

                {/* Checkout button */}
                <Link to="/checkout" className="btn btn-forest btn-lg"
                  style={{ width:'100%', justifyContent:'center', marginTop:18, display:'flex', alignItems:'center', gap:9 }}>
                  Checkout <MdArrowForward size={16} />
                </Link>

                <Link to="/products"
                  style={{ display:'block', textAlign:'center', marginTop:14, fontSize:13, color:'var(--ink-soft)' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop:14, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {['🔒 Secure', '🚚 Fresh Delivery', '🌿 Organic'].map((b,i) => (
                <span key={i} style={{ fontSize:11, fontWeight:600, color:'var(--ink-soft)', background:'var(--forest-mist)', padding:'5px 12px', borderRadius:100, border:'1px solid var(--border)' }}>
                  {b}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Cart;