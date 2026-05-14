import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoLeafOutline, IoExpandOutline } from 'react-icons/io5';
import { TbTractor, TbCamera } from 'react-icons/tb';
import { MdOutlinePhotoLibrary } from 'react-icons/md';
import { BsCameraVideo } from 'react-icons/bs';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

/* ─── LOCAL IMAGE LOADER ─── */
const loadImg = (p) => {
  try { return require(`../assets/${p}`); }
  catch { return null; }
};

/* ─── GALLERY ITEMS ─── */
const GALLERY_ITEMS = [
  { id: 1,  type: 'image', src: loadImg('cow1.jpeg')          || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85', thumb: loadImg('cow1.jpeg')          || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=70', title: 'Healthy Indigenous Cattle',  caption: 'Well-bred and properly maintained cattle from our trusted farm', span: 'wide' },
  { id: 2,  type: 'image', src: loadImg('cow2.jpeg')          || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=85', thumb: loadImg('cow2.jpeg')          || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=70', title: 'Farm-Raised Premium Bull',   caption: 'Powerful and healthy bull nurtured in a clean and natural farm environment.', span: 'normal' },
  { id: 3,  type: 'image', src: loadImg('desi ghee.png')      || 'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=800&q=85', thumb: loadImg('desi ghee.png')      || 'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=400&q=70', title: 'Pure Desi Ghee',         caption: 'Hand-churned using traditional Bilona method — pure A2 goodness', span: 'normal' },
  { id: 4,  type: 'image', src: loadImg('freshmilk.png')      || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=85', thumb: loadImg('freshmilk.png')      || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=70', title: 'Fresh Farm Milk',        caption: 'Pure unadulterated farm-fresh milk delivered daily', span: 'tall' },
  { id: 5,  type: 'image', src: loadImg('jackfruit.png')      || 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=800&q=85', thumb: loadImg('jackfruit.png')      || 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=400&q=70', title: 'Organic Jackfruit',      caption: "Nature's meat alternative — fresh jackfruit from our farm", span: 'wide' },
  { id: 6,  type: 'image', src: loadImg('Langdamango.png')    || 'https://images.unsplash.com/photo-1571493516031-5e90d98b1d1b?w=800&q=85', thumb: loadImg('Langdamango.png')    || 'https://images.unsplash.com/photo-1571493516031-5e90d98b1d1b?w=400&q=70', title: 'Langda Mango Orchard',  caption: 'Our Langda mango trees — naturally ripened', span: 'normal' },
  { id: 7,  type: 'image', src: loadImg('Amrapalimangoes.png')|| 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=85', thumb: loadImg('Amrapalimangoes.png')|| 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=70', title: 'Amrapali Variety',       caption: 'Deep orange pulp Amrapali mangoes — regular bearers all season', span: 'normal' },
  { id: 8,  type: 'image', src: loadImg('lemon.png')          || 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&q=85', thumb: loadImg('lemon.png')          || 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=70', title: 'Fresh Organic Lemons',  caption: 'Juicy tangy lemons packed with Vitamin C', span: 'normal' },
  { id: 9,  type: 'image', src: loadImg('Kaju.png')           || 'https://images.unsplash.com/photo-1563113952-e43de389e001?w=800&q=85', thumb: loadImg('Kaju.png')           || 'https://images.unsplash.com/photo-1563113952-e43de389e001?w=400&q=70', title: 'Premium Cashews',       caption: 'Creamy whole cashews — premium grade', span: 'wide' },
  { id: 10, type: 'image', src: loadImg('star fruit.png')     || 'https://images.unsplash.com/photo-1599248839238-4a23dbdb55fc?w=800&q=85', thumb: loadImg('star fruit.png')     || 'https://images.unsplash.com/photo-1599248839238-4a23dbdb55fc?w=400&q=70', title: 'Star Fruit',            caption: 'Exotic tropical star fruit full of antioxidants', span: 'normal' },
  { id: 11, type: 'video', src: loadImg('tree2.mp4')          || '', thumb: null, title: 'Farm Video',            caption: 'Rich aromatic Mallika mangoes', span: 'normal' },
  { id: 12, type: 'image', src: loadImg('tree1.jpeg')         || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85', thumb: loadImg('tree1.jpeg')         || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=70', title: 'Mallika Mangoes',       caption: 'Rich aromatic Mallika mangoes', span: 'normal' },
  { id: 13, type: 'image', src: loadImg('tree3.jpeg')         || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=85', thumb: loadImg('tree3.jpeg')         || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=70', title: 'Mallika Mangoes',       caption: 'Rich aromatic Mallika mangoes', span: 'normal' },
  { id: 14, type: 'video', src: loadImg('cow3.mp4')           || '', thumb: null, title: 'Farm Life',             caption: 'A glimpse into our daily farm life', span: 'normal' },
];

/* ─── FILTER TABS — only 3 ─── */
const FILTER_TABS = [
  { key: 'all',   label: 'All',    Icon: MdOutlinePhotoLibrary },
  { key: 'image', label: 'Images', Icon: IoLeafOutline },
  { key: 'video', label: 'Videos', Icon: BsCameraVideo },
];

/* ─── ANIMATION ─── */
const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardAnim = {
  hidden:  { opacity: 0, scale: 0.93, y: 24 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};

/* ─── LIGHTBOX ─── */
const Lightbox = ({ item, onClose, onPrev, onNext }) => {
  if (!item) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(10,18,10,0.94)',
          backdropFilter:'blur(8px)', display:'flex', alignItems:'center',
          justifyContent:'center', padding:20 }}
      >
        {/* CLOSE */}
        <motion.button onClick={onClose} whileHover={{ scale:1.1, rotate:90 }} whileTap={{ scale:0.9 }}
          style={{ position:'fixed', top:20, right:20, zIndex:10000, width:46, height:46,
            borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)',
            background:'rgba(255,255,255,0.1)', color:'white', cursor:'pointer' }}>
          <IoClose size={22} />
        </motion.button>

        {/* PREV */}
        <motion.button onClick={(e)=>{ e.stopPropagation(); onPrev(); }} whileHover={{ scale:1.05 }}
          style={{ position:'fixed', left:16, top:'50%', transform:'translateY(-50%)', width:46,
            height:46, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)',
            background:'rgba(255,255,255,0.1)', color:'white', fontSize:24, cursor:'pointer' }}>
          ‹
        </motion.button>

        {/* NEXT */}
        <motion.button onClick={(e)=>{ e.stopPropagation(); onNext(); }} whileHover={{ scale:1.05 }}
          style={{ position:'fixed', right:16, top:'50%', transform:'translateY(-50%)', width:46,
            height:46, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)',
            background:'rgba(255,255,255,0.1)', color:'white', fontSize:24, cursor:'pointer' }}>
          ›
        </motion.button>

        {/* CONTENT */}
        <motion.div onClick={(e)=>e.stopPropagation()} initial={{ scale:0.9 }} animate={{ scale:1 }}
          exit={{ scale:0.9 }} style={{ width:'100%', maxWidth:900 }}>
          {item.type === 'video' ? (
            <video controls autoPlay style={{ width:'100%', maxHeight:'72vh', borderRadius:18 }}>
              <source src={item.src} type="video/mp4" />
            </video>
          ) : (
            <img src={item.src} alt={item.title}
              style={{ width:'100%', maxHeight:'72vh', objectFit:'contain', borderRadius:18 }} />
          )}
          <div style={{ textAlign:'center', marginTop:18 }}>
            <h3 style={{ color:'white', fontFamily:'var(--font-display)', fontSize:'clamp(20px,2vw,28px)' }}>
              {item.title}
            </h3>
            <p style={{ color:'rgba(255,255,255,0.7)', marginTop:8, fontSize:14 }}>{item.caption}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── MAIN COMPONENT ─── */
const Gallery = () => {
  const [filter, setFilter]   = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const visible = GALLERY_ITEMS.filter(
    (item) => filter === 'all' || item.type === filter
  );

  const openLightbox  = (idx) => setLightbox(idx);
  const closeLightbox = ()    => setLightbox(null);
  const prevItem = () => setLightbox((i) => (i - 1 + visible.length) % visible.length);
  const nextItem = () => setLightbox((i) => (i + 1) % visible.length);

  useEffect(() => {
    const fn = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevItem();
      if (e.key === 'ArrowRight') nextItem();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lightbox, visible.length]);

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      {/* HERO */}
      <div style={{ background:'var(--forest-deep)', padding:'clamp(52px,8vw,88px) 0',
        position:'relative', overflow:'hidden' }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={cardAnim} style={{ display:'inline-flex', alignItems:'center',
              gap:8, background:'rgba(255,255,255,0.08)', padding:'8px 16px',
              borderRadius:100, marginBottom:20 }}>
              <MangoIcon width={15} height={15} style={{ fill:'var(--beige)' }} />
              <span style={{ color:'var(--beige)', fontSize:12, fontWeight:700,
                letterSpacing:'0.1em', textTransform:'uppercase' }}>Farm Gallery</span>
            </motion.div>

            <motion.h1 variants={cardAnim} style={{ fontFamily:'var(--font-display)',
              fontSize:'clamp(38px,6vw,72px)', color:'white', lineHeight:1.05, marginBottom:16 }}>
              Organic Farm <br />Gallery
            </motion.h1>

            <motion.p variants={cardAnim} style={{ color:'rgba(255,255,255,0.7)',
              maxWidth:520, fontSize:16, lineHeight:1.8 }}>
              Explore our mango orchards, organic products and naturally ripened
              harvests directly from our farm.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* FILTERS — 3 tabs only */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border)',
        position:'sticky', top:'var(--nav-h)', zIndex:100 }}>
        <div className="container" style={{ padding:'16px 0', display:'flex',
          gap:10, flexWrap:'wrap' }}>
          {FILTER_TABS.map(({ key, label, Icon }) => (
            <motion.button key={key} onClick={() => setFilter(key)}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              style={{ padding:'9px 18px', borderRadius:100,
                border: filter === key ? '1.5px solid var(--forest)' : '1.5px solid var(--border)',
                background: filter === key ? 'var(--forest)' : 'white',
                color: filter === key ? 'white' : 'var(--ink-mid)',
                display:'flex', alignItems:'center', gap:8,
                fontWeight:600, cursor:'pointer' }}>
              <Icon size={15} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <section className="section" style={{ background:'var(--cream)' }}>
        <div className="container">
          <motion.div variants={stagger} initial="hidden" animate="visible"
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
              gridAutoRows:'240px', gap:16 }}>
            {visible.map((item, idx) => (
              <motion.div key={item.id} variants={cardAnim} whileHover={{ y:-6 }}
                onClick={() => openLightbox(idx)}
                style={{ position:'relative', overflow:'hidden', borderRadius:18,
                  cursor:'pointer',
                  gridColumn: item.span === 'wide' ? 'span 2' : 'span 1',
                  gridRow:    item.span === 'tall' ? 'span 2' : 'span 1',
                  background:'#1a1a1a', boxShadow:'var(--shadow-sm)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>

                {/* THUMBNAIL */}
                {item.type === 'video' ? (
                  <>
                    <video muted preload="metadata"
                      style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }}>
                      <source src={item.src + '#t=0.5'} type="video/mp4" />
                    </video>
                    {/* play badge */}
                    <div style={{ position:'absolute', top:'50%', left:'50%',
                      transform:'translate(-50%,-50%)', pointerEvents:'none',
                      background:'rgba(255,255,255,0.18)', borderRadius:'50%',
                      width:54, height:54, display:'flex', alignItems:'center',
                      justifyContent:'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <img src={item.thumb || item.src} alt={item.title} loading="lazy"
                    style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                )}

                {/* HOVER OVERLAY */}
                <motion.div initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                  style={{ position:'absolute', inset:0,
                    background:'linear-gradient(to top, rgba(0,0,0,0.86), transparent)',
                    padding:18, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                  <h3 style={{ color:'white', fontFamily:'var(--font-display)', fontSize:20 }}>
                    {item.title}
                  </h3>
                  <p style={{ color:'rgba(255,255,255,0.74)', fontSize:13, lineHeight:1.6, marginTop:6 }}>
                    {item.caption}
                  </p>
                  <div style={{ marginTop:12, display:'inline-flex', alignItems:'center', gap:6,
                    background:'rgba(255,255,255,0.16)', padding:'6px 12px', borderRadius:100,
                    color:'white', fontSize:12, width:'fit-content' }}>
                    <IoExpandOutline size={13} />
                    View Full
                  </div>
                </motion.div>

                {/* TYPE BADGE */}
                <div style={{ position:'absolute', top:12, left:12,
                  background:'rgba(255,255,255,0.92)', padding:'5px 10px', borderRadius:100,
                  display:'flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700,
                  textTransform:'uppercase', color:'var(--forest-deep)' }}>
                  {item.type === 'video'
                    ? <BsCameraVideo size={11} />
                    : <IoLeafOutline size={11} />}
                  {item.type}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'var(--forest)', padding:'clamp(52px,7vw,88px) 0',
        textAlign:'center' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <TbCamera size={14} color="var(--beige)" />
              <span style={{ color:'var(--beige)', fontWeight:700, fontSize:12,
                letterSpacing:'0.1em', textTransform:'uppercase' }}>Visit Our Farm</span>
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,52px)',
              color:'white', marginBottom:16 }}>Like What You See?</h2>
            <p style={{ color:'rgba(255,255,255,0.7)', maxWidth:500, margin:'0 auto 30px',
              lineHeight:1.8 }}>
              Visit our store or order fresh organic products directly from our farm.
            </p>
            <motion.a href="/products" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              className="btn btn-beige btn-lg"
              style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
              <MangoIcon width={16} height={16} style={{ fill:'currentColor' }} />
              Shop Products
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <Lightbox item={visible[lightbox]} onClose={closeLightbox}
          onPrev={prevItem} onNext={nextItem} />
      )}
    </div>
  );
};

export default Gallery;