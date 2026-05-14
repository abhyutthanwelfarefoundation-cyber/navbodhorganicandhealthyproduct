import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../services/api';
import { getProductImage } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [qty,      setQty]      = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    getProduct(id).then(p => {
      setProduct(p);
      if (p) getProducts({ category: p.category }).then(all => setRelated(all.filter(x => x._id !== p._id).slice(0, 3)));
    });
  }, [id]);

  const addToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.emoji} ${product.name} × ${qty} added to cart!`, {
      style: { background: '#263d2a', color: 'white', borderRadius: 10, fontFamily: "'Jost', sans-serif" },
    });
  };

  if (!product) return (
    <div style={{ paddingTop: 'calc(var(--nav-h) + 100px)', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 2s infinite' }}>🌿</div>
        <div style={{ color: 'var(--ink-soft)', fontSize: 16 }}>Loading product…</div>
      </div>
    </div>
  );

  const img = getProductImage(product);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--beige-warm)', borderBottom: '1px solid var(--border-warm)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--ink-soft)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--forest-mid)' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--forest-mid)' }}>Products</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(32px,6vw,72px)', alignItems: 'start' }}>

            {/* Image */}
            <div>
              <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
                <img
                  src={img}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }}
                />
                {product.featured && (
                  <div style={{ position: 'absolute', top: 18, right: 18, background: 'var(--soil)', color: 'white', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Assurance strip below image */}
              <div style={{ marginTop: 20, background: 'white', borderRadius: 14, padding: '18px 22px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 12 }}>
                {['🌿 Organic', '🚜 Farm Direct', '⚡ Fresh'].map((a, i) => (
                  <div key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--forest-deep)', display: 'flex', alignItems: 'center', gap: 6 }}>{a}</div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.badge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--forest-mist)', color: 'var(--forest-deep)', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16, border: '1px solid var(--border)' }}>
                  {product.badge}
                </div>
              )}

              {product.origin && (
                <div className="eyebrow" style={{ marginBottom: 10 }}>📍 {product.origin}</div>
              )}

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 20 }}>
                {product.emoji} {product.name}
              </h1>

              <p style={{ fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.85, color: 'var(--ink-mid)', marginBottom: 28 }}>
                {product.description}
              </p>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                  {product.tags.map(t => (
                    <span key={t} style={{ background: 'var(--forest-mist)', color: 'var(--forest-deep)', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, border: '1px solid var(--border)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              {product.price ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,58px)', fontWeight: 700, color: 'var(--forest-deep)', lineHeight: 1 }}>₹{product.price}</span>
                    <span style={{ fontSize: 16, color: 'var(--ink-soft)' }}>per {product.unit}</span>
                  </div>

                  {/* Qty selector */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 48, background: 'var(--cream)', fontSize: 20, cursor: 'pointer', border: 'none', color: 'var(--ink)', fontFamily: 'var(--font-body)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.target.style.background = 'var(--forest-mist)'}
                        onMouseLeave={e => e.target.style.background = 'var(--cream)'}>−</button>
                      <span style={{ width: 52, textAlign: 'center', fontWeight: 700, fontSize: 17, background: 'white', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 48, background: 'var(--cream)', fontSize: 20, cursor: 'pointer', border: 'none', color: 'var(--ink)', fontFamily: 'var(--font-body)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.target.style.background = 'var(--forest-mist)'}
                        onMouseLeave={e => e.target.style.background = 'var(--cream)'}>+</button>
                    </div>
                    <button onClick={addToCart} className="btn btn-forest btn-lg" style={{ flex: 1, minWidth: 180 }}>
                      🛒 Add to Cart — ₹{product.price * qty}
                    </button>
                  </div>

                  <Link to="/checkout" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    📦 Buy Now
                  </Link>
                </>
              ) : (
                <a href="tel:07714040459" className="btn btn-forest btn-lg">📞 Call to Enquire</a>
              )}

              {/* Delivery info */}
              <div style={{ marginTop: 24, background: 'var(--beige-warm)', borderRadius: 12, padding: '14px 18px', border: '1px solid var(--border-warm)', fontSize: 13, color: 'var(--ink-mid)' }}>
                🚚 <strong>Free delivery</strong> across Raipur · 📦 Same-day dispatch available · 📞 <a href="tel:7471145013" style={{ color: 'var(--forest)' }}>7471145013</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--forest-mist)' }}>
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 10 }}>You Might Also Like</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,34px)', color: 'var(--ink)', marginBottom: 28 }}>Related Products</h3>
            <div className="grid-3">
              {related.map(p => (
                <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card">
                    <div className="product-card-img" style={{ height: 160 }}>
                      <img src={getProductImage(p)} alt={p.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {p.badge && <span className="product-badge">{p.badge}</span>}
                    </div>
                    <div className="product-card-body">
                      <h4 className="product-name" style={{ fontSize: 16 }}>{p.emoji} {p.name}</h4>
                      {p.price && <div className="product-price" style={{ fontSize: 20, marginTop: 8 }}>₹{p.price}<span style={{ fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--ink-soft)', marginLeft: 4 }}>/{p.unit}</span></div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
