import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STATIC_PRODUCTS } from '../services/api';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';
import { IoLeafOutline } from 'react-icons/io5';
import { MdArrowForward, MdPhone, MdVerified } from 'react-icons/md';
import { TbFlask, TbTractor, TbLeaf } from 'react-icons/tb';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

const loadImg = (p) => { try { return require(`../assets/${p}`); } catch { return null; } };
const HeroImg = loadImg('Dasherimango.png') || 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=1400&q=90';

const FACTS = [
  { Icon: TbFlask,     title: 'No Calcium Carbide',  desc: 'We never use artificial ripening agents. Every mango ripens naturally on the tree.' },
  { Icon: TbLeaf,      title: 'Organic Orchards',     desc: 'All orchards are certified organic — no synthetic fertilisers or pesticides, ever.' },
  { Icon: MangoIcon,     title: 'Peak Ripeness',        desc: 'Picked only when perfectly ripe for maximum sweetness, aroma and nutrition.' },
  { Icon: TbTractor,   title: 'Express Delivery',     desc: 'Delivered quickly so you get them at the exact peak of flavour and freshness.' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] } },
};

const MangoesPage = () => {
  // ── instant load from static data ──
  const mangoes = STATIC_PRODUCTS.filter(p => p.category === 'mango');

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.img src={HeroImg} alt="Mangoes"
          initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          transition={{ duration: 6, ease: 'easeOut' }}
          style={{ width: '100%', height: 'clamp(270px,42vw,520px)', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(26,44,28,0.92) 0%, rgba(42,75,46,0.74) 50%, rgba(26,44,28,0.28) 100%)' }} />

        <div className="container" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 9,
              background: 'rgba(232,213,176,0.16)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(232,213,176,0.28)', borderRadius: 100,
              padding: '7px 18px', marginBottom: 20, alignSelf: 'flex-start' }}>
              <MangoIcon width={14} height={14} style={{ fill: 'var(--beige)' }} />
              <span style={{ color: 'var(--beige)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Star Collection
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5.5vw,72px)', color: 'white', lineHeight: 1.06, fontWeight: 600, maxWidth: 600 }}>
              Our Mango<br />
              <em style={{ color: 'var(--beige)', fontStyle: 'italic' }}>Varieties</em>
            </motion.h1>
            <motion.p variants={fadeUp}
              style={{ color: 'rgba(255,255,255,0.80)', fontSize: 'clamp(13px,1.5vw,16px)', marginTop: 16, maxWidth: 420, lineHeight: 1.78 }}>
              7 premium organic varieties, hand-picked at peak ripeness from the finest orchards across India.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Benefits bar */}
      <motion.div style={{ background: 'var(--soil)', padding: '13px 0' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="container" style={{ display: 'flex', gap: 'clamp(14px,3vw,44px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { Icon: IoLeafOutline,  label: 'Naturally Ripened' },
            { Icon: TbFlask,        label: 'No Chemicals'      },
            { Icon: TbTractor,      label: 'Farm Direct'       },
            { Icon: MdVerified,     label: 'Quality Checked'   },
          ].map(({ Icon, label }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'white', fontWeight: 600, fontSize: 'clamp(11px,1.2vw,13px)', whiteSpace: 'nowrap' }}>
              <Icon size={15} />
              {label}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Marquee />

      {/* Variety grid */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(24px,4vw,48px)', flexWrap: 'wrap', gap: 16 }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div>
              <motion.span variants={fadeUp} className="eyebrow"
                style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                <MangoIcon width={13} height={13} style={{ fill: 'var(--forest-mid)' }} /> All Varieties
              </motion.span>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.5vw,44px)', color: 'var(--ink)' }}>
                Pick Your Favourite
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}
              style={{ background: 'var(--forest-mist)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 700, color: 'var(--forest-deep)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <IoLeafOutline size={15} color="var(--forest)" />
              All Organically Grown
            </motion.div>
          </motion.div>

          {/* Instant product grid */}
          <div className="grid-auto">
            {mangoes.map((m, i) => <ProductCard key={m._id} product={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* Why our mangoes */}
      <section className="section" style={{ background: 'var(--beige-warm)' }}>
        <div className="container">
          <motion.div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,52px)' }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="eyebrow"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              <IoLeafOutline size={13} color="var(--forest-mid)" /> Our Difference
            </motion.span>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,44px)', color: 'var(--ink)' }}>
              Why Our Mangoes Are Different
            </motion.h2>
          </motion.div>
          <div className="grid-4">
            {FACTS.map(({ Icon, title, desc }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
                whileHover={{ y: -7, boxShadow: '0 24px 56px rgba(58,92,63,0.18)' }}
                style={{ background: 'white', borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.3s', cursor: 'default' }}>
              <motion.div
  style={{
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'var(--forest-mist)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  }}
  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
  transition={{ duration: 0.4 }}
>
  {Icon === MangoIcon ? (
    <MangoIcon width={24} height={24} style={{ fill: 'var(--forest)' }} />
  ) : (
    <Icon size={24} />
  )}
</motion.div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,1.8vw,20px)', color: 'var(--ink)', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.72 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--forest-deep)', padding: 'clamp(52px,7vw,88px) 0', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="eyebrow eyebrow-light"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
              <MdPhone size={13} /> Order Today
            </motion.span>
            <motion.h2 variants={fadeUp}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,50px)', color: 'white', marginBottom: 14 }}>
              Ready to Order Your Mangoes?
            </motion.h2>
            <motion.p variants={fadeUp}
              style={{ color: 'rgba(255,255,255,0.62)', fontSize: 15, marginBottom: 32 }}>
              Call us or place your order online — fresh delivery across Raipur.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a href="tel:7471145013" className="btn btn-beige btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MdPhone size={18} /> 747 114 5013
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/order" className="btn btn-outline-white btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MangoIcon width={17} height={17} style={{ fill: 'currentColor' }} /> Order Online
                  <MdArrowForward size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default MangoesPage;