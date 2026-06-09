import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { MdAddShoppingCart, MdShare, MdClose } from 'react-icons/md';
import { IoLocationSharp } from 'react-icons/io5';
import { TbLeaf, TbBrandWhatsapp } from 'react-icons/tb';
import { FaInstagram, FaTelegram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { HiLink } from 'react-icons/hi';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';

/* ── Local asset loader ── */
const loadImg = (p) => { try { return require(`../assets/${p}`); } catch { return null; } };

export const PRODUCT_IMAGES = {
  'Dasheri Mango':  loadImg('Dasherimango.png'),
  'Banganapalli':   loadImg('Banganapallimango.png'),
  'Langda':         loadImg('Langdamango.png'),
  'Shafeda':        loadImg('Shafedamangoes.png'),
  'Tota Pari':      loadImg('TotaParimangoes.png'),
  'Amrapali':       loadImg('Amrpalimangoes.png'),
  'Mallika':        loadImg('Mallikamangoes.png'),
  'Pure Desi Ghee': loadImg('desi ghee2.png'),
  'Fresh Milk':     loadImg('freshmilk.png'),
  'Jackfruit':      loadImg('jackfruit.png'),
  'Fresh Lemon':    loadImg('lemon.png'),
  'Kaju (Cashews)': loadImg('Kaju.png'),
  'Star Fruit':     loadImg('star fruit.png'),
};

const FALLBACKS = {
  mango: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=75',
  dairy: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=75',
  fruit: 'https://images.unsplash.com/photo-1563746924237-f4471932d9e7?w=400&q=75',
  nut:   'https://images.unsplash.com/photo-1563113952-e43de389e001?w=400&q=75',
};

export const getProductImage = (product) =>
  PRODUCT_IMAGES[product.name] || FALLBACKS[product.category] || FALLBACKS.mango;

/* category icon */
const CategoryIcon = ({ category, size = 13 }) => {
  if (category === 'mango') {
    return <MangoIcon style={{ width: size, height: size, fill: 'currentColor', flexShrink: 0 }} />;
  }
  return <TbLeaf size={size} />;
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.34, 1.2, 0.64, 1] } },
};

/* ── Share Sheet Component ── */
const ShareSheet = ({ product, onClose }) => {
  const url     = `${window.location.origin}/products/${product._id}`;
  const text    = `🌿 Check out ${product.name} from Navbodh Organics!\n${product.price ? `Only ₹${product.price}/${product.unit}` : ''}\n100% Organic & Farm Fresh 🥭\n`;
  const encoded = encodeURIComponent(text + url);

  const platforms = [
    {
      name: 'WhatsApp',
      icon: <TbBrandWhatsapp size={22} />,
      color: '#25D366',
      bg: '#e8fdf0',
      url: `https://wa.me/?text=${encoded}`,
    },
    {
      name: 'Instagram',
      icon: <FaInstagram size={20} />,
      color: '#E1306C',
      bg: '#fde8f0',
      url: `https://www.instagram.com/`,  // Instagram doesn't support direct share links — opens app
    },
    {
      name: 'Facebook',
      icon: <FaFacebook size={20} />,
      color: '#1877F2',
      bg: '#e8f0fe',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      icon: <FaTelegram size={20} />,
      color: '#0088CC',
      bg: '#e8f5fd',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter size={20} />,
      color: '#1DA1F2',
      bg: '#e8f4fd',
      url: `https://twitter.com/intent/tweet?text=${encoded}`,
    },
    {
      name: 'Copy Link',
      icon: <HiLink size={20} />,
      color: '#6b7280',
      bg: '#f3f4f6',
      action: () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied!', { icon: '🔗' });
        onClose();
      },
    },
  ];

  // Use native share if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
        onClose();
      } catch {}
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 0 0',
      }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '24px 24px 0 0',
          padding: '24px 24px 40px', width: '100%', maxWidth: 480,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}>

        {/* Handle */}
        <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 100, margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#1a2c1c' }}>Share Product</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{product.name}</div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
            <MdClose size={18} />
          </button>
        </div>

        {/* Native share button (mobile) */}
        {navigator.share && (
          <button onClick={handleNativeShare}
            style={{ width: '100%', padding: '13px', background: 'var(--forest-deep)', color: 'white', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)' }}>
            <MdShare size={18} /> Share via Apps
          </button>
        )}

        {/* Platform grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {platforms.map((p) => (
            p.action ? (
              <button key={p.name} onClick={p.action}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: p.bg, border: 'none', borderRadius: 14, cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ color: p.color }}>{p.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{p.name}</span>
              </button>
            ) : (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                onClick={onClose}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: p.bg, borderRadius: 14, textDecoration: 'none', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ color: p.color }}>{p.icon}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{p.name}</span>
              </a>
            )
          ))}
        </div>

        {/* URL bar */}
        <div style={{ marginTop: 18, display: 'flex', gap: 8, background: '#f9fafb', borderRadius: 12, padding: '10px 14px', border: '1px solid #e5e7eb' }}>
          <div style={{ flex: 1, fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </div>
          <button onClick={() => { navigator.clipboard.writeText(url); toast.success('Copied!', { icon: '🔗' }); onClose(); }}
            style={{ background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            Copy
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main ProductCard ── */
const ProductCard = ({ product, showAdd = true, index = 0 }) => {
  const { dispatch } = useCart();
  const [showShare, setShowShare] = useState(false);
  const img = getProductImage(product);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MdAddShoppingCart size={18} />
        <strong>{product.name}</strong> added to cart
      </span>,
      {
        style: { background: 'var(--forest-deep)', color: 'white', borderRadius: 12, fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '10px 16px' },
        iconTheme: { primary: 'var(--beige)', secondary: 'var(--forest-deep)' },
        duration: 2000,
      }
    );
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShare(true);
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <Link to={`/products/${product._id}`} style={{ display: 'flex', textDecoration: 'none' }}>
          <div className="product-card" style={{ width: '100%', position: 'relative' }}>

            {/* Image */}
            <div className="product-card-img">
              <img
                src={img}
                alt={product.name}
                loading="lazy"
                onError={e => { e.target.src = FALLBACKS[product.category] || FALLBACKS.mango; }}
              />
              {product.inStock && product.badge && <span className="product-badge">{product.badge}</span>}
              {product.inStock && product.featured && <span className="product-featured-badge">Featured</span>}
              {!product.inStock && (
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#dc2626', color: 'white', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                  Out of Stock
                </span>
              )}

              {/* Share button on image */}
              <button
                onClick={handleShare}
                style={{
                  position: 'absolute', bottom: 10, right: 10,
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--forest-deep)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--forest-deep)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; e.currentTarget.style.color = 'var(--forest-deep)'; }}
              >
                <MdShare size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="product-card-body">
              {product.origin && (
                <div className="product-origin">
                  <IoLocationSharp size={11} />
                  {product.origin}
                </div>
              )}
              <h3 className="product-name" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CategoryIcon category={product.category} size={15} />
                {product.name}
              </h3>
              <p className="product-desc">{product.description.slice(0, 85)}…</p>

              <div className="product-footer">
                <div>
                  {product.price ? (
                    <>
                      <div className="product-price">₹{product.price}</div>
                      <div className="product-unit">per {product.unit}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Enquire for price</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {/* Share button in footer */}
                  <button
                    onClick={handleShare}
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--forest-mist)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--forest)',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--forest)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--forest-mist)'; e.currentTarget.style.color = 'var(--forest)'; }}
                  >
                    <MdShare size={15} />
                  </button>

                  {showAdd && product.price && (
                    <button className="add-btn" onClick={handleAdd}
                      disabled={!product.inStock}
                      style={{ opacity: product.inStock ? 1 : 0.5, cursor: product.inStock ? 'pointer' : 'not-allowed' }}>
                      {product.inStock ? <><MdAddShoppingCart size={15} /> Add</> : 'Out of Stock'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Share Sheet */}
      <AnimatePresence>
        {showShare && <ShareSheet product={product} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;