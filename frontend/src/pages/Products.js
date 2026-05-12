import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIC_PRODUCTS } from '../services/api';
import ProductCard from '../components/ProductCard';
import { IoLeafOutline, IoSearchOutline } from 'react-icons/io5';
import { TbMilk, TbNut, TbApple } from 'react-icons/tb';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

const CATS = [
  { key: 'all',   label: 'All Products', Icon: IoLeafOutline },
{ 
  key: 'mango', 
  label: 'Mangoes', 
  Icon: (props) => (
    <MangoIcon 
      width={14} 
      height={14} 
      style={{ fill: 'currentColor', display: 'block' }} 
      {...props}
    />
  ) 
},
  { key: 'dairy', label: 'Dairy',        Icon: TbMilk        },
  { key: 'fruit', label: 'Fruits',       Icon: TbApple       },
  { key: 'nut',   label: 'Nuts',         Icon: TbNut         },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.34, 1.2, 0.64, 1] } },
};

const Products = () => {
  const [cat,    setCat]    = useState('all');
  const [search, setSearch] = useState('');

  const all = STATIC_PRODUCTS;

  const filtered = all.filter(p => {
    const matchCat  = cat === 'all' || p.category === cat;
    const matchSrch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* Header */}
      <div style={{ background: 'var(--forest-deep)', padding: 'clamp(52px,8vw,88px) 0 clamp(40px,5vw,60px)', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span variants={fadeUp} className="eyebrow eyebrow-light"
              style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <IoLeafOutline size={13} /> All Natural
            </motion.span>
            <motion.h1 variants={fadeUp}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,5.5vw,66px)', color: 'white', lineHeight: 1.06, marginBottom: 12, fontWeight: 600 }}>
              Our Products
            </motion.h1>
            <motion.p variants={fadeUp}
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px,1.5vw,16px)' }}>
              Fresh, organic produce from farm to your table
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 'var(--nav-h)', zIndex: 10, boxShadow: '0 2px 16px rgba(58,92,63,0.07)' }}>
        <div className="container" style={{ padding: 'clamp(10px,1.5vw,16px) 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(({ key, label, Icon }) => (
              <motion.button key={key}
                onClick={() => setCat(key)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: '8px 16px', borderRadius: 100,
                  border: '1.5px solid',
                  borderColor: cat === key ? 'var(--forest)' : 'var(--border)',
                  background:  cat === key ? 'var(--forest)' : 'white',
                  color:       cat === key ? 'white'         : 'var(--ink-mid)',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                <Icon size={13} />
                {label}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <IoSearchOutline size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)', pointerEvents: 'none' }} />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 36, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
                border: '1.5px solid var(--border)', borderRadius: 100,
                fontSize: 13, fontFamily: 'var(--font-body)',
                outline: 'none', background: 'var(--cream)', color: 'var(--ink)',
                minWidth: 200, transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--forest-mid)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          {/* Result count */}
          <motion.div
            key={`${cat}-${search}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IoLeafOutline size={14} color="var(--forest-mid)" />
            Showing <strong style={{ color: 'var(--forest)', marginLeft: 4, marginRight: 4 }}>{filtered.length}</strong> products
            {search && <> matching "<strong>{search}</strong>"</>}
          </motion.div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '80px 0' }}>
                <IoSearchOutline size={56} color="var(--border)" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: 8 }}>No products found</div>
                <div style={{ color: 'var(--ink-soft)' }}>Try a different search or category</div>
              </motion.div>
            ) : (
              <motion.div key={`${cat}-${search}`}
                className="grid-auto"
                variants={stagger} initial="hidden" animate="visible">
                {filtered.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Products;