import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { STATIC_PRODUCTS, submitEnquiry } from '../services/api';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import toast from 'react-hot-toast';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

/* react-icons */
import {GiLeafSwirl, GiFarmer, GiMilkCarton } from 'react-icons/gi';
import { IoLeafOutline, IoLocationSharp, IoTimeOutline } from 'react-icons/io5';
import { MdVerified, MdDeliveryDining, MdPhone, MdStar, MdArrowForward, MdSend } from 'react-icons/md';
import { TbLeaf, TbTractor, TbFlask, TbStar } from 'react-icons/tb';
import { BsShieldCheck, BsArrowRight } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';

/* local assets */
const loadImg = (p) => { try { return require(`../assets/${p}`); } catch { return null; } };
const HeroBg     = loadImg('Dasherimango.png')   || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=1400&q=90';
const GheeImg    = loadImg('desi ghee2.png')       || 'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=700&q=80';
const VARIETIES  = [
  { name: 'Dasheri',      origin: 'Uttar Pradesh',  badge: 'Sweet & Fibrous',   img: loadImg('Dasherimango.png') },
  { name: 'Banganapalli', origin: 'Andhra Pradesh', badge: 'Large & Juicy',     img: loadImg('Banganapallimango.png') },
  { name: 'Langda',       origin: 'Varanasi',       badge: 'Turpentine Free',   img: loadImg('Langdamango.png') },
  { name: 'Shafeda',      origin: 'Maharashtra',    badge: 'Mild & Fragrant',   img: loadImg('Shafedamangoes.png') },
  { name: 'Tota Pari',    origin: 'Andhra Pradesh', badge: 'Unique Beak Shape', img: loadImg('TotaParimangoes.png') },
  { name: 'Amrapali',     origin: 'All India',      badge: 'Regular Bearer',    img: loadImg('Amrpalimangoes.png') },
  { name: 'Mallika',      origin: 'Hybrid Variety', badge: 'Neelam × Dasheri', img: loadImg('Mallikamangoes.png') },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  loc: 'Samta Colony', stars: 5, text: 'Best mangoes I\'ve ever tasted in Raipur! The Dasheri variety is absolutely divine. Fresh, sweet, zero chemicals — you can taste the difference.' },
  { name: 'Rahul Verma',   loc: 'Raipur',       stars: 5, text: 'Their desi ghee is pure and aromatic — exactly the way my dadi used to make it. Regular customer for ghee and milk. Highly recommended!' },
  { name: 'Anita Tiwari',  loc: 'Civil Lines',  stars: 4, text: 'Love the variety of mangoes here — from Langda to Amrapali, everything is fresh and naturally ripened. Great organic store in Raipur.' },
];

const PILLARS = [
  { Icon: IoLeafOutline,  title: '100% Organic',     desc: 'No pesticides, no chemicals. Every product grown and sourced naturally to protect your health and the planet.' },
  { Icon: TbTractor,      title: 'Direct from Farm',  desc: 'We cut out middlemen and source straight from trusted farmers — fresher produce, fair farmer prices.' },
  { Icon: MdDeliveryDining, title: 'Fresh Delivery', desc: 'Farm-fresh products at peak freshness. Quick delivery across Raipur and surrounding areas daily.' },
  { Icon: BsShieldCheck,  title: 'Trusted Quality',   desc: '3.8★ Google rating with hundreds of happy families. Quality you can taste in every bite.' },
];

const TRUST = [
  { Icon: TbFlask,         label: 'No Pesticides'       },
  { Icon: MdVerified,      label: 'Certified Organic'   },
  { Icon: TbTractor,       label: 'Farm Direct'         },
  { Icon: MdDeliveryDining,label: 'Fresh Daily'         },
  { Icon: BsShieldCheck,   label: 'Quality Guaranteed'  },
];

/* animated counter */
function useCountUp(target, duration = 1800, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    let t0;
    const frame = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration, go]);
  return v;
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.34, 1.2, 0.64, 1] } },
};
const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.34, 1.2, 0.64, 1] } },
};
const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.34, 1.2, 0.64, 1] } },
};

const FloatingLeaves = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }}>
    {[
      { top: '15%', left: '8%',  size: 28, delay: 0,   dur: 6 },
      { top: '30%', right: '6%', size: 20, delay: 1.5, dur: 8 },
      { top: '60%', left: '5%',  size: 16, delay: 0.8, dur: 7 },
      { top: '70%', right: '9%', size: 22, delay: 2,   dur: 5 },
      { top: '45%', left: '3%',  size: 14, delay: 3,   dur: 9 },
    ].map((l, i) => (
      <motion.div key={i}
        style={{ position: 'absolute', top: l.top, left: l.left, right: l.right, color: 'rgba(200,222,202,0.5)' }}
        animate={{ y: [0, -20, 0], rotate: [0, 12, -8, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}>
        <GiLeafSwirl size={l.size} />
      </motion.div>
    ))}
  </div>
);

const Stars = ({ n }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <MdStar key={i} size={16} color={i < n ? 'var(--soil)' : '#d4c4a0'} />
    ))}
  </div>
);

/* ── Field wrapper with error display ── */
const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: error ? '#dc2626' : 'var(--ink-mid)',
    }}>{label}</label>
    {children}
    {error && (
      <span style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
        ⚠ {error}
      </span>
    )}
  </div>
);

const inputBase = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--border-warm)', borderRadius: 10,
  fontSize: 14, fontFamily: 'var(--font-body)',
  outline: 'none', background: 'white', color: 'var(--ink)',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const inputError = { borderColor: '#fca5a5' };
const inputOk    = { borderColor: '#86efac' };

const Home = () => {
  const products      = STATIC_PRODUCTS;
  const featuredProds = products.filter(p => p.featured);
  const nonMangoProds = products.filter(p => p.category !== 'mango').slice(0, 6);

  const EMPTY = { name: '', phone: '', email: '', product: '', message: '' };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [statsGo, setStatsGo] = useState(false);
  const statsRef = useRef(null);

  const ratingV   = useCountUp(38,  1800, statsGo);
  const familiesV = useCountUp(500, 2200, statsGo);
  const mangoesV  = useCountUp(7,   1400, statsGo);

  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });
  useEffect(() => { if (statsInView) setStatsGo(true); }, [statsInView]);

  /* ── Validation rules ── */
  const validate = (f) => {
    const e = {};
    if (!f.name.trim())                          e.name    = 'Name is required';
    else if (f.name.trim().length < 2)           e.name    = 'Name must be at least 2 characters';

    if (!f.phone)                                e.phone   = 'Phone number is required';
    else if (!/^\d+$/.test(f.phone))             e.phone   = 'Only digits allowed';
    else if (f.phone.length !== 10)              e.phone   = 'Must be exactly 10 digits';
    else if (!/^[6-9]/.test(f.phone))            e.phone   = 'Enter a valid Indian mobile number';

    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                                                 e.email   = 'Enter a valid email address';
    return e;
  };

  /* live validation on touched fields */
  useEffect(() => {
    const e = validate(form);
    const visible = {};
    Object.keys(touched).forEach(k => { if (touched[k] && e[k]) visible[k] = e[k]; });
    setErrors(visible);
  }, [form, touched]);

  const touch = (k) => setTouched(t => ({ ...t, [k]: true }));

  /* phone: only allow digits, max 10 */
  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, phone: val }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    /* touch all fields to show all errors */
    setTouched({ name: true, phone: true, email: true, product: true, message: true });
    const e2 = validate(form);
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      toast.error('Please fix the errors before submitting');
      return;
    }
    setSending(true);
    try {
      await submitEnquiry(form);
      toast.success("✅ Message sent! We'll call you shortly 🌿");
      setForm(EMPTY);
      setTouched({});
      setErrors({});
    } catch {
      toast.error('Something went wrong. Please call us directly.');
    }
    setSending(false);
  };

  /* field border colour helper */
  const borderStyle = (k) => {
    if (!touched[k]) return {};
    return errors[k] ? inputError : inputOk;
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <motion.img src={HeroBg} alt=""
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 7, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(110deg, rgba(26,44,28,0.93) 0%, rgba(42,75,46,0.80) 45%, rgba(26,44,28,0.50) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0.45, pointerEvents: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E\")" }} />
        <FloatingLeaves />

        <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: 52, paddingBottom: 76 }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ maxWidth: 680 }}>
            <motion.div variants={fadeUp}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(232,213,176,0.14)', backdropFilter: 'blur(10px)', border: '1px solid rgba(232,213,176,0.28)', borderRadius: 100, padding: '8px 20px', marginBottom: 28 }}>
                <motion.div animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <HiOutlineSparkles size={14} color="var(--beige)" />
                </motion.div>
                <span style={{ color: 'var(--beige)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>100% Organic · Raipur, CG</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px,7.5vw,98px)', color: 'white', lineHeight: 1.02, fontWeight: 600, marginBottom: 22 }}>
              Nature's Finest,<br />
              <motion.em style={{ color: 'transparent', fontStyle: 'italic', display: 'block', backgroundImage: 'linear-gradient(90deg, var(--beige) 0%, #f5d98a 50%, var(--beige) 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                animate={{ backgroundPosition: ['0% center', '200% center', '0% center'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                Delivered Fresh
              </motion.em>
              to Your Door
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.84)', lineHeight: 1.82, maxWidth: 500, marginBottom: 40 }}>
              Premium organic mangoes, pure ghee, fresh milk, jackfruit and more — straight from nature's heart to your family's table.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/mangoes" className="btn btn-beige btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MangoIcon width={20} height={20} /> Explore Mangoes
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/products" className="btn btn-outline-white btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <IoLeafOutline size={18} /> All Products
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, marginTop: 54, flexWrap: 'wrap' }}>
              {[{ value: '3.8★', label: 'Google Rating' }, { value: '7+', label: 'Mango Varieties' }, { value: '100%', label: 'Organic' }].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -4, scale: 1.05 }}
                  style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16, padding: '14px 22px', minWidth: 110 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700, color: 'white', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.60)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div style={{ position: 'absolute', bottom: 28, left: '50%', translateX: '-50%', zIndex: 3, color: 'rgba(255,255,255,0.5)' }}
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <BsArrowRight size={22} style={{ transform: 'rotate(90deg)' }} />
        </motion.div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee />

      {/* ══ TRUST STRIP ══ */}
      <motion.div className="trust-strip" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="trust-strip-inner">
          {TRUST.map(({ Icon, label }, i) => (
            <motion.div key={i} className="trust-item" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
              <Icon size={18} className="trust-icon" /> {label}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══ MANGO VARIETIES ══ */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <motion.div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,52px)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
            <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              <MangoIcon width={14} height={14} style={{ fill: 'var(--forest-mid)' }} /> Star Collection
            </motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Our Mango Varieties</motion.h2>
            <motion.p variants={fadeUp} className="section-sub" style={{ margin: '12px auto 0', textAlign: 'center' }}>
              Hand-picked at peak ripeness from the finest orchards across India — 7 premium varieties.
            </motion.p>
          </motion.div>

          <div className="grid-variety">
            {VARIETIES.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: i * 0.07, duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }} whileHover={{ y: -6 }}>
                <Link to="/mangoes" style={{ textDecoration: 'none' }}>
                  <div className="variety-card">
                    <div className="variety-card-img">
                      <img src={m.img || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&q=75'} alt={m.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&q=75'; }} />
                    </div>
                    <div className="variety-card-body">
                      <MangoIcon width={22} height={22} style={{ fill: 'var(--soil-light)', margin: '0 auto 6px' }} />
                      <div className="variety-name">{m.name}</div>
                      <div className="variety-origin">{m.origin}</div>
                      <div className="variety-pill">{m.badge}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div style={{ textAlign: 'center', marginTop: 38 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Link to="/mangoes" className="btn btn-forest btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <MangoIcon width={18} height={18} /> View All Varieties <MdArrowForward size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ MARQUEE 2 ══ */}
      <Marquee dark />

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(24px,4vw,48px)', flexWrap: 'wrap', gap: 16 }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <div>
              <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <IoLeafOutline size={13} /> All Natural
              </motion.span>
              <motion.h2 variants={fadeUp} className="section-title">More Organic Goodness</motion.h2>
              <motion.p variants={fadeUp} className="section-sub">Beyond mangoes — pure, farm-fresh products for every kitchen</motion.p>
            </div>
            <motion.div variants={fadeRight} className="hide-mobile">
              <Link to="/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                See All Products <MdArrowForward size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid-auto">
            {(featuredProds.length > 0 ? featuredProds : nonMangoProds).slice(0, 6).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }} className="hide-tablet">
            <Link to="/products" className="btn btn-outline mobile-full" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, maxWidth: 300 }}>
              See All Products <MdArrowForward size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} style={{ background: 'var(--forest-deep)', padding: 'clamp(60px,9vw,104px) 0', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,213,176,0.06)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}
          animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div style={{ textAlign: 'center', marginBottom: 56 }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.span variants={fadeUp} className="eyebrow eyebrow-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              <TbStar size={13} /> By the Numbers
            </motion.span>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,46px)', color: 'white' }}>
              Trusted by Families Across Raipur
            </motion.h2>
          </motion.div>

          <div className="grid-3" style={{ textAlign: 'center', gap: 'clamp(16px,3vw,36px)' }}>
            {[
              { value: `${(ratingV / 10).toFixed(1)}★`, label: 'Google Rating',   sub: 'From happy customers', Icon: TbStar },
              { value: `${mangoesV}+`,                   label: 'Mango Varieties', sub: 'Premium organic',      Icon: () => <MangoIcon width={36} height={36} /> },
              { value: `${familiesV}+`,                  label: 'Happy Families',  sub: 'Served in Raipur',     Icon: BsShieldCheck },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }} whileHover={{ y: -6, scale: 1.03 }}
                style={{ padding: 'clamp(24px,3vw,44px) 20px', background: 'rgba(255,255,255,0.07)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.10)', cursor: 'default' }}>
                <s.Icon size={36} color="var(--beige)" style={{ margin: '0 auto 14px', display: 'block', opacity: 0.85 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px,6vw,72px)', fontWeight: 700, color: 'var(--beige)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 'clamp(14px,1.8vw,18px)', marginTop: 12 }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 5 }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section className="section" style={{ background: 'var(--beige-warm)' }}>
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,56px)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              <MdVerified size={14} color="var(--forest-mid)" /> Our Promise
            </motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Why Choose Navbodh?</motion.h2>
            <motion.p variants={fadeUp} className="section-sub" style={{ margin: '12px auto 0', textAlign: 'center' }}>
              We're not just a store — we're your trusted organic partner, committed to quality and your family's health.
            </motion.p>
          </motion.div>
          <div className="grid-4">
            {PILLARS.map(({ Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 36, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: i * 0.1, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }} whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(58,92,63,0.20)' }}
                style={{ background: 'white', borderRadius: 18, padding: 'clamp(22px,3vw,32px) clamp(18px,2.5vw,26px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.3s', cursor: 'default' }}>
                <motion.div style={{ width: 54, height: 54, borderRadius: 15, background: 'var(--forest-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} transition={{ duration: 0.4 }}>
                  <Icon size={26} color="var(--forest)" />
                </motion.div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(17px,1.8vw,21px)', color: 'var(--ink)', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 'clamp(12px,1.2vw,14px)', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GHEE SPLIT ══ */}
      <section className="section" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'clamp(32px,6vw,84px)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeLeft}>
              <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
                <motion.img src={GheeImg} alt="Pure Desi Ghee" whileHover={{ scale: 1.04 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={staggerContainer}>
              <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <GiFarmer size={14} color="var(--forest-mid)" /> Pure &amp; Authentic
              </motion.span>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,50px)', color: 'var(--ink)', lineHeight: 1.1 }}>
                The Purest Desi Ghee You'll Ever Taste
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: 'clamp(13px,1.4vw,16px)', color: 'var(--ink-mid)', lineHeight: 1.85, marginTop: 18 }}>
                Our Pure Desi Ghee is hand-churned from fresh A2 cow's milk using the traditional <em>Bilona</em> method — slow-churned, separated, and simmered to golden perfection.
              </motion.p>
              <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, margin: '28px 0' }}>
                {['A2 Cow Milk','Bilona Churned','Zero Additives','Golden Aroma'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--forest-mist)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MdVerified size={12} color="var(--forest)" />
                    </div>
                    {f}
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/products/8" className="btn btn-forest btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  <GiMilkCarton size={17} /> Shop Desi Ghee <MdArrowForward size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section" style={{ background: 'var(--forest-mist)' }}>
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,52px)' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              <MdStar size={14} color="var(--forest-mid)" /> Real Stories
            </motion.span>
            <motion.h2 variants={fadeUp} className="section-title">What Our Customers Say</motion.h2>
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 10 }}>
              <Stars n={4} />
              <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>3.8 on Google Reviews · Raipur</span>
            </motion.div>
          </motion.div>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 36, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: i * 0.12, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }} whileHover={{ y: -6, boxShadow: '0 24px 56px rgba(58,92,63,0.16)' }}
                style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,2.5vw,32px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', cursor: 'default' }}>
                <Stars n={t.stars} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.75, color: 'var(--ink)', fontStyle: 'italic', flex: 1, margin: '16px 0' }}>"{t.text}"</p>
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--forest-mist)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--forest-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GiFarmer size={20} color="var(--forest)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>— {t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IoLocationSharp size={11} color="var(--soil-light)" /> {t.loc}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{ background: 'var(--forest)', padding: 'clamp(56px,8vw,96px) 0', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.span variants={fadeUp} className="eyebrow eyebrow-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
              <MdPhone size={13} /> Get in Touch
            </motion.span>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,5vw,58px)', color: 'white', marginBottom: 14 }}>Ready to Go Organic?</motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.68)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.82, maxWidth: 500, margin: '0 auto 36px' }}>
              Join hundreds of happy families in Raipur enjoying fresh, chemical-free produce delivered to their door.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a href="tel:7471145013" className="btn btn-beige btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MdPhone size={18} /> 7471145013
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn btn-outline-white btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MdSend size={16} /> Send Enquiry
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ CONTACT + FORM ══ */}
      <section className="section" style={{ background: 'var(--cream-warm)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(32px,6vw,72px)', alignItems: 'start' }}>

            {/* Contact info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.span variants={fadeUp} className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <IoLocationSharp size={13} color="var(--forest-mid)" /> Find Us
              </motion.span>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.5vw,44px)', color: 'var(--ink)', marginBottom: 32 }}>
                Visit or Call Us Today
              </motion.h2>
              {[
                { Icon: IoLocationSharp, label: 'Address', val: 'Okinawa Showroom Buliding , 1st Floor , Bangrang Nagar Main Rd,\nRaipur, Chhattisgarh 492001', href: null },
                { Icon: MdPhone,         label: 'Phone',   val: '7471145013', href: 'tel:7471145013' },
                { Icon: IoTimeOutline,   label: 'Hours',   val: 'Open daily until 8:30 PM', href: null },
              ].map(({ Icon, label, val, href }, i) => (
                <motion.div key={i} variants={fadeUp} style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--forest-mist)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color="var(--forest)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--forest-mid)', marginBottom: 5 }}>{label}</div>
                    {href
                      ? <a href={href} style={{ color: 'var(--ink-mid)', fontSize: 14, lineHeight: 1.78, whiteSpace: 'pre-line', display: 'block' }}>{val}</a>
                      : <div style={{ color: 'var(--ink-mid)', fontSize: 14, lineHeight: 1.78, whiteSpace: 'pre-line' }}>{val}</div>}
                  </div>
                </motion.div>
              ))}
              <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }}>
               <a href="https://maps.app.goo.gl/Wt4u1rJh9xZoabLaA " target="_blank" rel="noopener noreferrer"
                  className="btn btn-forest" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  <IoLocationSharp size={16} /> Open in Google Maps
                </a>
              </motion.div>
            </motion.div>

            {/* ── Enquiry form with validation ── */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
              style={{ background: 'white', borderRadius: 24, padding: 'clamp(24px,3.5vw,42px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <MdSend size={16} color="var(--forest-mid)" />
                <span className="eyebrow">Enquiry</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.5vw,32px)', color: 'var(--ink)', marginBottom: 26 }}>Send Us a Message</h3>

              <form onSubmit={handleForm} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <Field label="Your Name *" error={errors.name}>
                  <input
                    type="text" placeholder="Full name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onBlur={() => touch('name')}
                    style={{ ...inputBase, ...borderStyle('name') }}
                  />
                </Field>

                {/* Phone */}
                <Field label="Phone Number *" error={errors.phone}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--ink-soft)', pointerEvents: 'none', fontWeight: 600 }}>+91</span>
                    <input
                      type="tel" placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handlePhone}
                      onBlur={() => touch('phone')}
                      maxLength={10}
                      inputMode="numeric"
                      style={{ ...inputBase, ...borderStyle('phone'), paddingLeft: 46 }}
                    />
                    {/* digit counter */}
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: form.phone.length === 10 ? '#16a34a' : 'var(--ink-soft)', fontWeight: 600 }}>
                      {form.phone.length}/10
                    </span>
                  </div>
                </Field>

                {/* Email */}
                <Field label="Email (optional)" error={errors.email}>
                  <input
                    type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onBlur={() => touch('email')}
                    style={{ ...inputBase, ...borderStyle('email') }}
                  />
                </Field>

                {/* Product */}
                <Field label="Product Interested In" error={errors.product}>
                  <input
                    type="text" placeholder="e.g. Dasheri Mango, Desi Ghee…" value={form.product}
                    onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                    style={{ ...inputBase }}
                  />
                </Field>

                {/* Message */}
                <Field label="Message" error={errors.message}>
                  <textarea
                    rows={4} placeholder="Tell us what you need…" value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inputBase, resize: 'vertical' }}
                  />
                </Field>

                <motion.button type="submit" className="btn btn-forest btn-lg" disabled={sending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ opacity: sending ? 0.7 : 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 9, marginTop: 4 }}>
                  <MdSend size={16} />
                  {sending ? 'Sending…' : 'Send Enquiry'}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
                  🔒 Your details are safe with us
                </p>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;