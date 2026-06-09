import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, getProducts } from "../services/api";
import { getProductImage } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { MdShare } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from 'react-helmet-async';
import { TbBrandWhatsapp } from 'react-icons/tb';
import { FaFacebook, FaTelegram, FaTwitter } from 'react-icons/fa';
import { HiLink } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';

const shareBtnVariants = {
  rest:  { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 8, transition: { type: "spring", stiffness: 300 } },
  tap:   { scale: 0.9 },
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product,   setProduct]   = useState(null);
  const [related,   setRelated]   = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [qty,       setQty]       = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    getProduct(id).then((p) => {
      setProduct(p);
      if (p) getProducts({ category: p.category }).then((all) =>
        setRelated(all.filter((x) => x._id !== p._id).slice(0, 3))
      );
    });
  }, [id]);

  const addToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD_ITEM", payload: product });
    toast.success(`${product.emoji} ${product.name} × ${qty} added to cart!`, {
      style: { background: "#263d2a", color: "white", borderRadius: 10, fontFamily: "'Jost', sans-serif" },
    });
  };

  if (!product) return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 100px)", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>
        <div style={{ fontSize: 48, marginBottom: 12, animation: "float 2s infinite" }}>🌿</div>
        <div style={{ color: "var(--ink-soft)", fontSize: 16 }}>Loading product…</div>
      </div>
    </div>
  );

  const img        = getProductImage(product);
  const pageUrl    = `https://www.navbodhorganic.com/products/${product._id}`;
  const shareText  = `🌿 ${product.name} from Navbodh Organics!\n${product.price ? `Only ₹${product.price}/${product.unit} · ` : ''}100% Organic & Farm Fresh 🥭\n`;
  const encoded    = encodeURIComponent(shareText + pageUrl);

  const platforms = [
    { name: 'WhatsApp', icon: <TbBrandWhatsapp size={22}/>, color: '#25D366', bg: '#e8fdf0', url: `https://wa.me/?text=${encoded}` },
    { name: 'Facebook', icon: <FaFacebook size={20}/>,      color: '#1877F2', bg: '#e8f0fe', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
    { name: 'Telegram', icon: <FaTelegram size={20}/>,      color: '#0088CC', bg: '#e8f5fd', url: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: 'Twitter',  icon: <FaTwitter size={20}/>,       color: '#1DA1F2', bg: '#e8f4fd', url: `https://twitter.com/intent/tweet?text=${encoded}` },
    {
      name: 'Copy Link', icon: <HiLink size={20}/>, color: '#6b7280', bg: '#f3f4f6',
      action: () => { navigator.clipboard.writeText(pageUrl); toast.success('🔗 Link copied!'); setShowShare(false); }
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText, url: pageUrl });
        setShowShare(false);
      } catch {}
    }
  };

  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>

      {/* ── Open Graph / Social Meta Tags ── */}
      <Helmet>
        <title>{product.name} — Navbodh Organics</title>
        <meta name="description" content={`${product.description} | ₹${product.price} per ${product.unit} | 100% Organic, Farm Fresh. Free delivery in Raipur.`} />

        {/* Open Graph — Facebook, WhatsApp, LinkedIn */}
        <meta property="og:type"        content="product" />
        <meta property="og:site_name"   content="Navbodh Organics" />
        <meta property="og:title"       content={`${product.emoji} ${product.name} — Navbodh Organics`} />
        <meta property="og:description" content={`${product.price ? `₹${product.price} per ${product.unit} · ` : ''}${product.description} | 100% Organic, Farm Fresh. Free delivery in Raipur.`} />
        <meta property="og:image"       content={img.startsWith('http') ? img : `https://www.navbodhorganic.com${img}`} />
        <meta property="og:image:width"  content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:url"         content={pageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={`${product.name} — Navbodh Organics`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image"       content={img.startsWith('http') ? img : `https://www.navbodhorganic.com${img}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div style={{ background: "var(--beige-warm)", borderBottom: "1px solid var(--border-warm)", padding: "14px 0" }}>
        <div className="container" style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--ink-soft)", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "var(--forest-mid)" }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: "var(--forest-mid)" }}>Products</Link>
          <span>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="grid-2" style={{ gap: "clamp(32px,6vw,72px)", alignItems: "start" }}>

            {/* Image */}
            <div>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-lg)", position: "relative" }}>
                <img src={img} alt={product.name}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"; }}
                />
                {/* Share button */}
                <motion.button onClick={() => setShowShare(true)}
                  variants={shareBtnVariants} initial="rest" whileHover="hover" whileTap="tap"
                  style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--forest-deep)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10 }}>
                  <MdShare size={16} />
                </motion.button>
                {product.featured && (
                  <div style={{ position: "absolute", top: 18, left: 18, background: "var(--soil)", color: "white", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Assurance strip */}
              <div style={{ marginTop: 20, background: "white", borderRadius: 14, padding: "18px 22px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
                {["🌿 Organic", "🚜 Farm Direct", "⚡ Fresh"].map((a, i) => (
                  <div key={i} style={{ fontSize: 13, fontWeight: 700, color: "var(--forest-deep)", display: "flex", alignItems: "center", gap: 6 }}>{a}</div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.badge && (
                <div style={{ display: "inline-flex", alignItems: "center", background: "var(--forest-mist)", color: "var(--forest-deep)", padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 16, border: "1px solid var(--border)" }}>
                  {product.badge}
                </div>
              )}
              {product.origin && <div className="eyebrow" style={{ marginBottom: 10 }}>📍 {product.origin}</div>}
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,48px)", color: "var(--ink)", lineHeight: 1.1, marginBottom: 20 }}>
                {product.emoji} {product.name}
              </h1>
              <p style={{ fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.85, color: "var(--ink-mid)", marginBottom: 28 }}>
                {product.description}
              </p>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
                  {product.tags.map((t) => (
                    <span key={t} style={{ background: "var(--forest-mist)", color: "var(--forest-deep)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "1px solid var(--border)" }}>#{t}</span>
                  ))}
                </div>
              )}

              {/* Share row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '12px 16px', background: 'var(--forest-mist)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-mid)', fontWeight: 600, flex: 1 }}>Share this product</span>
                {platforms.filter(p => p.name !== 'Copy Link').map(p => (
                  p.url ? (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                      title={p.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color, textDecoration: 'none', flexShrink: 0, transition: 'transform 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      {p.icon}
                    </a>
                  ) : null
                ))}
                <button onClick={() => { navigator.clipboard.writeText(pageUrl); toast.success('🔗 Link copied!'); }}
                  title="Copy Link"
                  style={{ width: 34, height: 34, borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <HiLink size={18} />
                </button>
              </div>

              {/* Price */}
              {product.price ? (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px,5vw,58px)", fontWeight: 700, color: "var(--forest-deep)", lineHeight: 1 }}>₹{product.price}</span>
                    <span style={{ fontSize: 16, color: "var(--ink-soft)" }}>per {product.unit}</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border)", borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 44, height: 48, background: "var(--cream)", fontSize: 20, cursor: "pointer", border: "none", color: "var(--ink)", fontFamily: "var(--font-body)", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.target.style.background = "var(--forest-mist)")}
                        onMouseLeave={(e) => (e.target.style.background = "var(--cream)")}>−</button>
                      <span style={{ width: 52, textAlign: "center", fontWeight: 700, fontSize: 17, background: "white", height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} style={{ width: 44, height: 48, background: "var(--cream)", fontSize: 20, cursor: "pointer", border: "none", color: "var(--ink)", fontFamily: "var(--font-body)", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.target.style.background = "var(--forest-mist)")}
                        onMouseLeave={(e) => (e.target.style.background = "var(--cream)")}>+</button>
                    </div>
                    <button onClick={addToCart} className="btn btn-forest btn-lg"
                      disabled={!product.inStock}
                      style={{ flex: 1, minWidth: 180, opacity: product.inStock ? 1 : 0.6, cursor: product.inStock ? "pointer" : "not-allowed" }}>
                      {product.inStock ? `🛒 Add to Cart — ₹${product.price * qty}` : "❌ Out of Stock"}
                    </button>
                  </div>
                  <Link to="/checkout" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>📦 Buy Now</Link>
                </>
              ) : (
                <a href="tel:7471145013" className="btn btn-forest btn-lg">📞 Call to Enquire</a>
              )}

              {/* Delivery info */}
              <div style={{ marginTop: 24, background: "var(--beige-warm)", borderRadius: 12, padding: "14px 18px", border: "1px solid var(--border-warm)", fontSize: 13, color: "var(--ink-mid)" }}>
                🚚 <strong>Free delivery</strong> across Raipur · 📦 Same-day dispatch · 📞 <a href="tel:7471145013" style={{ color: "var(--forest)" }}>7471145013</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: "var(--forest-mist)" }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 10 }}>You Might Also Like</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,34px)", color: "var(--ink)", marginBottom: 28 }}>Related Products</h3>
            <div className="grid-3">
              {related.map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration: "none" }}>
                  <div className="product-card">
                    <div className="product-card-img" style={{ height: 160 }}>
                      <img src={getProductImage(p)} alt={p.name}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70"; }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {p.badge && <span className="product-badge">{p.badge}</span>}
                    </div>
                    <div className="product-card-body">
                      <h4 className="product-name" style={{ fontSize: 16 }}>{p.emoji} {p.name}</h4>
                      {p.price && <div className="product-price" style={{ fontSize: 20, marginTop: 8 }}>₹{p.price}<span style={{ fontSize: 11, fontFamily: "var(--font-body)", color: "var(--ink-soft)", marginLeft: 4 }}>/{p.unit}</span></div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Share Bottom Sheet ── */}
      <AnimatePresence>
        {showShare && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowShare(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '24px 24px 40px', width: '100%', maxWidth: 480, boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>

              <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 100, margin: '0 auto 20px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#1a2c1c' }}>Share Product</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{product.name}</div>
                </div>
                <button onClick={() => setShowShare(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <MdClose size={18} />
                </button>
              </div>

              {navigator.share && (
                <button onClick={handleNativeShare}
                  style={{ width: '100%', padding: '13px', background: 'var(--forest-deep)', color: 'white', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)' }}>
                  <MdShare size={18} /> Share via Apps
                </button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {platforms.map((p) => (
                  p.action ? (
                    <button key={p.name} onClick={p.action}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: p.bg, border: 'none', borderRadius: 14, cursor: 'pointer' }}>
                      <div style={{ color: p.color }}>{p.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{p.name}</span>
                    </button>
                  ) : (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => setShowShare(false)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: p.bg, borderRadius: 14, textDecoration: 'none' }}>
                      <div style={{ color: p.color }}>{p.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{p.name}</span>
                    </a>
                  )
                ))}
              </div>

              <div style={{ marginTop: 18, display: 'flex', gap: 8, background: '#f9fafb', borderRadius: 12, padding: '10px 14px', border: '1px solid #e5e7eb' }}>
                <div style={{ flex: 1, fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageUrl}</div>
                <button onClick={() => { navigator.clipboard.writeText(pageUrl); toast.success('Copied!'); setShowShare(false); }}
                  style={{ background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  Copy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;