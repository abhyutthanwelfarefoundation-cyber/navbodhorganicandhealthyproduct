import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoClose, IoPlayCircle, IoLeafOutline, IoExpandOutline,
  IoImagesOutline, IoVideocamOutline,
} from 'react-icons/io5';
import { TbCamera } from 'react-icons/tb';
import { MdOutlinePhotoLibrary } from 'react-icons/md';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

const loadAsset = (p) => { try { return require(`../assets/${p}`); } catch { return null; } };

/* ══════════════════════════════════════
   GALLERY ITEMS  — edit titles/captions
══════════════════════════════════════ */
const GALLERY_ITEMS = [
  { id:1,  type:'image', src:loadAsset('cow1.jpeg'),          title:'Our Farm Cows',         caption:'Our A2 cows — the source of pure desi ghee and fresh milk' },
  { id:2,  type:'image', src:loadAsset('cow2.jpeg'),          title:'Happy Cows',             caption:'Healthy, happy cows raised naturally on our organic farm' },
  { id:3,  type:'image', src:loadAsset('tree1.jpeg'),         title:'Mango Orchard',          caption:'Our mango orchards at peak season — naturally grown' },
  { id:4,  type:'image', src:loadAsset('tree3.jpeg'),         title:'Orchard View',           caption:'Green mango trees — no chemicals, no pesticides' },
  { id:5,  type:'image', src:loadAsset('desi ghee.png'),      title:'Pure Desi Ghee',         caption:'Hand-churned A2 ghee using traditional Bilona method' },
  { id:6,  type:'image', src:loadAsset('freshmilk.png'),      title:'Fresh Farm Milk',        caption:'Pure unadulterated farm-fresh milk delivered daily' },
  { id:7,  type:'image', src:loadAsset('jackfruit.png'),      title:'Organic Jackfruit',      caption:"Nature's meat alternative — fresh from our farm" },
  { id:8,  type:'image', src:loadAsset('Langdamango.png'),    title:'Langda Mangoes',         caption:'Naturally ripened Langda mangoes from Varanasi' },
  { id:9,  type:'image', src:loadAsset('Amrpalimangoes.png'), title:'Amrapali Mangoes',       caption:'Deep orange pulp — regular bearers all season' },
  { id:10, type:'image', src:loadAsset('lemon.png'),          title:'Organic Lemons',         caption:'Juicy Vitamin C rich lemons from our garden' },
  { id:11, type:'image', src:loadAsset('Kaju.png'),           title:'Premium Cashews',        caption:'Whole cashews — naturally dried, premium grade' },
  { id:12, type:'image', src:loadAsset('star fruit.png'),     title:'Star Fruit',             caption:'Exotic tropical star fruit full of antioxidants' },
  { id:13, type:'video', src:loadAsset('tree2.mp4'),          title:'Farm Tour',              caption:'A walk through our organic mango orchard' },
  { id:14, type:'video', src:loadAsset('cow3.mp4'),           title:'Our A2 Cows',            caption:'Meet the A2 cows behind our pure desi ghee' },
].filter(item => Boolean(item.src));

const TABS = [
  { key:'all',   label:'All',    Icon: MdOutlinePhotoLibrary, count: GALLERY_ITEMS.length },
  { key:'image', label:'Photos', Icon: IoImagesOutline,       count: GALLERY_ITEMS.filter(i=>i.type==='image').length },
  { key:'video', label:'Videos', Icon: IoVideocamOutline,     count: GALLERY_ITEMS.filter(i=>i.type==='video').length },
];

const stagger  = { hidden:{}, visible:{ transition:{ staggerChildren:0.07 } } };
const cardAnim = {
  hidden:  { opacity:0, y:28, scale:0.95 },
  visible: { opacity:1, y:0,  scale:1, transition:{ duration:0.5, ease:[0.34,1.2,0.64,1] } },
};

/* ── Lightbox ── */
const Lightbox = ({ item, total, index, onClose, onPrev, onNext }) => {
  if (!item) return null;
  return (
    <motion.div
      key="lightbox"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(6,12,6,0.97)', backdropFilter:'blur(12px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'16px',
      }}>

      {/* Close */}
      <motion.button onClick={onClose}
        whileHover={{ scale:1.12, rotate:90 }} whileTap={{ scale:0.9 }}
        style={{
          position:'fixed', top:16, right:16, zIndex:10000,
          width:44, height:44, borderRadius:'50%',
          border:'1px solid rgba(255,255,255,0.22)',
          background:'rgba(255,255,255,0.10)', color:'white',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        }}>
        <IoClose size={20} />
      </motion.button>

      {/* Counter */}
      <div style={{
        position:'fixed', top:20, left:'50%', transform:'translateX(-50%)',
        background:'rgba(255,255,255,0.10)', borderRadius:100,
        padding:'5px 14px', fontSize:12, color:'rgba(255,255,255,0.7)', fontWeight:600, zIndex:10000,
      }}>
        {index + 1} / {total}
      </div>

      {/* Prev */}
      <motion.button whileHover={{ scale:1.1 }}
        onClick={e => { e.stopPropagation(); onPrev(); }}
        style={{
          position:'fixed', left:10, top:'50%', transform:'translateY(-50%)',
          width:44, height:44, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.20)',
          background:'rgba(255,255,255,0.10)', color:'white', fontSize:26,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000,
        }}>‹</motion.button>

      {/* Next */}
      <motion.button whileHover={{ scale:1.1 }}
        onClick={e => { e.stopPropagation(); onNext(); }}
        style={{
          position:'fixed', right:10, top:'50%', transform:'translateY(-50%)',
          width:44, height:44, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.20)',
          background:'rgba(255,255,255,0.10)', color:'white', fontSize:26,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000,
        }}>›</motion.button>

      {/* Media */}
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ scale:0.88, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        exit={{ scale:0.88, opacity:0 }}
        transition={{ duration:0.32, ease:[0.34,1.2,0.64,1] }}
        style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>

        {item.type === 'video' ? (
          <video controls autoPlay playsInline
            style={{
              width:'100%', maxHeight:'72vh', borderRadius:14,
              background:'#000', display:'block', outline:'none',
            }}>
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <img
            src={item.src} alt={item.title}
            style={{
              maxWidth:'100%', maxHeight:'72vh',
              objectFit:'contain', borderRadius:14, display:'block',
            }}
          />
        )}

        <div style={{ textAlign:'center', padding:'0 8px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(18px,2.2vw,24px)', color:'white', fontWeight:600 }}>
            {item.title}
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', marginTop:6 }}>{item.caption}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Gallery ── */
const Gallery = () => {
  const [filter,   setFilter]   = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const visible = GALLERY_ITEMS.filter(i => filter === 'all' || i.type === filter);

  // keyboard nav
  useEffect(() => {
    const fn = (e) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + visible.length) % visible.length);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % visible.length);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [lightbox, visible.length]);

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>

      {/* ── Hero ── */}
      <div style={{
        background:'var(--forest-deep)',
        padding:'clamp(48px,8vw,88px) 0 clamp(36px,5vw,56px)',
        position:'relative', overflow:'hidden',
      }}>
        <motion.div
          style={{ position:'absolute', top:-80, right:-80, width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}
          animate={{ scale:[1,1.12,1] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut' }} />

        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* eyebrow */}
            <motion.div variants={cardAnim}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.09)', padding:'7px 16px', borderRadius:100, marginBottom:18 }}>
              <MangoIcon width={13} height={13} style={{ fill:'var(--beige)' }} />
              <span style={{ color:'var(--beige)', fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>
                Farm Gallery
              </span>
            </motion.div>

            <motion.h1 variants={cardAnim}
              style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,6vw,72px)', color:'white', lineHeight:1.05, marginBottom:14, fontWeight:600 }}>
              Organic Farm<br />
              <em style={{ color:'var(--beige)', fontStyle:'italic' }}>Gallery</em>
            </motion.h1>

            <motion.p variants={cardAnim}
              style={{ color:'rgba(255,255,255,0.65)', maxWidth:480, fontSize:'clamp(14px,1.5vw,16px)', lineHeight:1.8 }}>
              Explore our mango orchards, A2 cows, organic products and naturally ripened harvests.
            </motion.p>

            {/* stats pills */}
            <motion.div variants={cardAnim} style={{ display:'flex', gap:10, marginTop:26, flexWrap:'wrap' }}>
              {[
                { Icon:IoImagesOutline,  label:`${GALLERY_ITEMS.filter(i=>i.type==='image').length} Photos` },
                { Icon:IoVideocamOutline,label:`${GALLERY_ITEMS.filter(i=>i.type==='video').length} Videos` },
                { Icon:IoLeafOutline,    label:'100% Organic' },
              ].map(({ Icon, label }, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.13)', borderRadius:10, padding:'8px 14px' }}>
                  <Icon size={13} color="var(--beige)" />
                  <span style={{ color:'rgba(255,255,255,0.78)', fontSize:12, fontWeight:600 }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{
        background:'white', borderBottom:'1px solid var(--border)',
        position:'sticky', top:'var(--nav-h)', zIndex:100,
        boxShadow:'0 2px 12px rgba(58,92,63,0.08)',
      }}>
        <div className="container" style={{ padding:'clamp(10px,1.5vw,14px) 28px', display:'flex', gap:8, flexWrap:'wrap' }}>
          {TABS.map(({ key, label, Icon, count }) => (
            <motion.button key={key}
              onClick={() => setFilter(key)}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              style={{
                padding:'8px 16px', borderRadius:100, cursor:'pointer',
                border:`1.5px solid ${filter===key ? 'var(--forest)' : 'var(--border)'}`,
                background: filter===key ? 'var(--forest)' : 'white',
                color:      filter===key ? 'white'         : 'var(--ink-mid)',
                fontFamily:'var(--font-body)', fontWeight:600, fontSize:13,
                display:'flex', alignItems:'center', gap:7, whiteSpace:'nowrap',
                transition:'all 0.18s',
              }}>
              <Icon size={14} />
              {label}
              <span style={{
                background: filter===key ? 'rgba(255,255,255,0.22)' : 'var(--forest-mist)',
                borderRadius:100, padding:'1px 8px', fontSize:11, fontWeight:700,
                color: filter===key ? 'white' : 'var(--forest)',
              }}>{count}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="section" style={{ background:'var(--cream)' }}>
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              variants={stagger} initial="hidden" animate="visible" exit={{ opacity:0, transition:{ duration:0.2 } }}
              style={{
                display:'grid',
                /* KEY FIX: minmax(0,1fr) prevents overflow; 1 col on mobile, 2 on tablet, 3 on desktop */
                gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap:16,
              }}>

              {visible.map((item, idx) => (
                <motion.div key={item.id}
                  variants={cardAnim}
                  whileHover={{ y:-4 }}
                  onClick={() => setLightbox(idx)}
                  style={{
                    borderRadius:16, overflow:'hidden', cursor:'pointer',
                    background:'white', border:'1px solid var(--border)',
                    boxShadow:'var(--shadow-sm)',
                    /* prevent card from going wider than its column */
                    minWidth:0, width:'100%',
                    transition:'box-shadow 0.25s, transform 0.25s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 44px rgba(58,92,63,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>

                  {/* ── Media area — FULL WIDTH, no black bars ── */}
                  <div style={{
                    width:'100%',
                    /* 4:3 ratio so portrait photos don't get cropped weirdly */
                    aspectRatio:'4/3',
                    overflow:'hidden',
                    background:'#1a2c1e',
                    position:'relative',
                  }}>
                    {item.type === 'video' ? (
                      <>
                        {/* video thumbnail via first frame */}
                        <video
                          src={item.src}
                          muted
                          preload="metadata"
                          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                        />
                        {/* play button overlay */}
                        <div style={{
                          position:'absolute', inset:0,
                          background:'rgba(10,22,10,0.35)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <motion.div whileHover={{ scale:1.15 }}
                            style={{ color:'white', filter:'drop-shadow(0 4px 14px rgba(0,0,0,0.6))' }}>
                            <IoPlayCircle size={58} />
                          </motion.div>
                        </div>
                        {/* VIDEO badge */}
                        <div style={{
                          position:'absolute', top:10, right:10,
                          background:'rgba(122,92,58,0.90)', backdropFilter:'blur(4px)',
                          borderRadius:100, padding:'4px 10px',
                          fontSize:10, fontWeight:700, color:'white',
                          display:'flex', alignItems:'center', gap:5,
                        }}>
                          <IoVideocamOutline size={11} /> VIDEO
                        </div>
                      </>
                    ) : (
                      /* IMAGE — objectFit:cover fills the box, no black bars */
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width:'100%', height:'100%',
                          objectFit:'cover', display:'block',
                          transition:'transform 0.5s ease',
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    )}

                    {/* hover overlay */}
                    <motion.div
                      initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                      style={{
                        position:'absolute', inset:0,
                        background:'linear-gradient(to top, rgba(26,44,28,0.82) 0%, transparent 55%)',
                        display:'flex', alignItems:'flex-end',
                        padding:'14px',
                        pointerEvents:'none',
                      }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.14)', backdropFilter:'blur(6px)', borderRadius:100, padding:'5px 12px', fontSize:11, color:'white', fontWeight:700 }}>
                        <IoExpandOutline size={12} />
                        {item.type === 'video' ? 'Play' : 'View Full'}
                      </div>
                    </motion.div>
                  </div>

                  {/* ── Info strip ── */}
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(15px,1.6vw,17px)', fontWeight:600, color:'var(--ink)', marginBottom:4, lineHeight:1.25 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize:12, color:'var(--ink-soft)', lineHeight:1.55 }}>
                      {item.caption}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {visible.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'80px 0' }}>
              <TbCamera size={52} color="var(--border)" style={{ margin:'0 auto 14px' }} />
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'var(--ink-soft)' }}>No items here yet</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--forest)', padding:'clamp(48px,7vw,80px) 0', textAlign:'center' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.55 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <TbCamera size={14} color="var(--beige)" />
              <span style={{ color:'var(--beige)', fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase' }}>
                Visit Our Farm
              </span>
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,50px)', color:'white', marginBottom:12 }}>
              Like What You See?
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', maxWidth:420, margin:'0 auto 28px', lineHeight:1.8, fontSize:'clamp(14px,1.5vw,16px)' }}>
              Visit our store at Samta Shopping Arcade, Raipur or order fresh products online.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <motion.a href="tel:07714040459" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="btn btn-beige btn-lg" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                📞 077140 40459
              </motion.a>
              <motion.a href="/products" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="btn btn-outline-white btn-lg" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                <IoLeafOutline size={16} /> Shop Products
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            item={visible[lightbox]}
            index={lightbox}
            total={visible.length}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(i => (i - 1 + visible.length) % visible.length)}
            onNext={() => setLightbox(i => (i + 1) % visible.length)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
