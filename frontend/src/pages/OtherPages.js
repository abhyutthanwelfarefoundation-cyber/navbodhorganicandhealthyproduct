// OrderSuccess.js
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitEnquiry } from '../services/api';

export const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get('id') || 'NVB-XXXXXX';
  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center', maxWidth: 520, padding: '48px 24px' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--forest-mist)', border: '3px solid var(--forest-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, margin: '0 auto 28px', animation: 'float 3s infinite' }}>🌿</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', color: 'var(--forest-deep)', marginBottom: 14 }}>Order Placed!</h1>
        <p style={{ fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.8, marginBottom: 28 }}>
          Thank you! Our team will call you shortly to confirm your order and arrange fresh delivery.
        </p>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', marginBottom: 36, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>Order ID</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--forest-deep)' }}>#{String(orderId).slice(-8).toUpperCase()}</div>
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:7471145013" className="btn btn-forest btn-lg">📞 7471145013</a>
          <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

// WhyUs.js
export const WhyUs = () => {
  const ITEMS = [
    { icon:'🌿', title:'100% Organic', desc:'No pesticides, no synthetic chemicals. Every product is grown with nature — certified and transparent.', img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80' },
    { icon:'🚜', title:'Direct from Farm', desc:'No middlemen, no cold storage delays. We source directly from trusted farmers for maximum freshness and fair prices.', img:'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&q=80' },
    { icon:'⚡', title:'Fresh Delivery', desc:'Products delivered at peak freshness every day across Raipur and surrounding areas — because freshness is everything.', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=80' },
    { icon:'💚', title:'Trusted Quality', desc:'3.8★ Google rating, hundreds of happy families. Quality you can taste in every mango, every drop of ghee.', img:'https://images.unsplash.com/photo-1631209121750-a9f656d28f24?w=700&q=80' },
  ];

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div style={{ background: 'var(--forest-deep)', padding: 'clamp(56px,8vw,96px) 0 clamp(44px,6vw,72px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow eyebrow-light" style={{ marginBottom: 14 }}>💚 Our Promise</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5.5vw,68px)', color: 'white', marginBottom: 14, fontWeight: 600 }}>Why Choose Navbodh?</h1>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 'clamp(14px,1.6vw,17px)', maxWidth: 500, lineHeight: 1.8 }}>
            We're not just a store — we're your trusted organic partner, committed to your family's health and happiness.
          </p>
        </div>
      </div>

      {ITEMS.map((item, i) => (
        <section key={i} className="section" style={{ background: i % 2 === 0 ? 'var(--cream)' : 'var(--beige-warm)' }}>
          <div className="container">
            <div className="grid-2" style={{ gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--forest-mist)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20 }}>{item.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3.5vw,44px)', color: 'var(--ink)', marginBottom: 16 }}>{item.title}</h2>
                <p style={{ fontSize: 'clamp(14px,1.5vw,16px)', color: 'var(--ink-mid)', lineHeight: 1.85 }}>{item.desc}</p>
              </div>
              <div style={{ order: i % 2 === 0 ? 1 : 0, borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', aspectRatio: '4/3' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80'; }} />
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ background: 'var(--forest)', padding: 'clamp(56px,7vw,88px) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4.5vw,52px)', color: 'white', marginBottom: 14 }}>Ready to Go Organic?</h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 16, marginBottom: 32 }}>Join hundreds of families in Raipur enjoying fresh, chemical-free produce daily.</p>
          <a href="tel:7471145013" className="btn btn-beige btn-lg">📞 Call: 7471145013</a>
        </div>
      </section>
    </div>
  );
};

// ── Shared validation & field styles ──────────────────────────────
const validate = (f) => {
  const e = {};
  if (!f.name.trim())               e.name  = 'Name is required';
  else if (f.name.trim().length < 2) e.name  = 'Name must be at least 2 characters';

  if (!f.phone)                      e.phone = 'Phone number is required';
  else if (!/^\d+$/.test(f.phone))   e.phone = 'Only digits allowed';
  else if (f.phone.length !== 10)    e.phone = 'Must be exactly 10 digits';
  else if (!/^[6-9]/.test(f.phone))  e.phone = 'Enter a valid Indian mobile number';

  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
                                     e.email = 'Enter a valid email address';
  return e;
};

const inputBase = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--border-warm)', borderRadius: 10,
  fontSize: 14, fontFamily: 'var(--font-body)',
  outline: 'none', background: 'white', color: 'var(--ink)',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
};

const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: error ? '#dc2626' : 'var(--ink-mid)' }}>
      {label}
    </label>
    {children}
    {error && <span style={{ fontSize: 12, color: '#dc2626' }}>⚠ {error}</span>}
  </div>
);
// ──────────────────────────────────────────────────────────────────

// Contact.js
export const Contact = () => {
  const EMPTY = { name: '', phone: '', email: '', product: '', message: '' };
  const [form,    setForm]    = React.useState(EMPTY);
  const [errors,  setErrors]  = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    const e = validate(form);
    const visible = {};
    Object.keys(touched).forEach(k => { if (touched[k] && e[k]) visible[k] = e[k]; });
    setErrors(visible);
  }, [form, touched]);

  const touch = (k) => setTouched(t => ({ ...t, [k]: true }));

  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, phone: val }));
  };

  const borderStyle = (k) => {
    if (!touched[k]) return {};
    return errors[k] ? { borderColor: '#fca5a5' } : { borderColor: '#86efac' };
  };

  const handle = async (e) => {
    e.preventDefault();
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
      toast.error('Please call us directly.');
    }
    setSending(false);
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div style={{ background: 'var(--forest-deep)', padding: 'clamp(56px,8vw,96px) 0 clamp(44px,6vw,72px)' }}>
        <div className="container">
          <div className="eyebrow eyebrow-light" style={{ marginBottom: 14 }}>📍 Find Us</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5.5vw,68px)', color: 'white', fontWeight: 600 }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.68)', marginTop: 12, fontSize: 16 }}>Visit our store or drop us a message — we'd love to hear from you!</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(32px,6vw,72px)', alignItems: 'start' }}>

            {/* Info */}
            <div>
              <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, height: 280, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14874.01!2d81.6337!3d21.2514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDE1JzA1LjAiTiA4McKwMzgnMDEuMiJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="280" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" />
              </div>
              {[
                { icon:'📍', label:'Address', val:'Samta Colony Main Rd, Samta Colony\nRaipur, Chhattisgarh 492001\nSamta Shopping Arcade', href:null },
                { icon:'📞', label:'Phone',   val:'7471145013', href:'tel:7471145013' },
                { icon:'🕐', label:'Hours',   val:'Open daily until 8:30 PM', href:null },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--forest-mist)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--forest-mid)', marginBottom: 4 }}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} style={{ color: 'var(--ink-mid)', fontSize: 14, lineHeight: 1.75, whiteSpace: 'pre-line', display: 'block' }}>{c.val}</a>
                      : <div style={{ color: 'var(--ink-mid)', fontSize: 14, lineHeight: 1.75, whiteSpace: 'pre-line' }}>{c.val}</div>}
                  </div>
                </div>
              ))}
              <a href="https://maps.google.com/?q=Samta+Colony+Raipur" target="_blank" rel="noopener noreferrer" className="btn btn-forest" style={{ marginTop: 10 }}>📍 Open in Google Maps</a>
            </div>

            {/* Form with validation */}
            <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(24px,3.5vw,40px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>✉️ Message</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.5vw,32px)', color: 'var(--ink)', marginBottom: 26 }}>Send an Enquiry</h3>
              <form onSubmit={handle} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <Field label="Your Name *" error={errors.name}>
                  <input type="text" placeholder="Full name" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onBlur={() => touch('name')}
                    style={{ ...inputBase, ...borderStyle('name') }} />
                </Field>

                {/* Phone */}
                <Field label="Phone Number *" error={errors.phone}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--ink-soft)', pointerEvents: 'none', fontWeight: 600 }}>+91</span>
                    <input type="tel" placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handlePhone}
                      onBlur={() => touch('phone')}
                      maxLength={10} inputMode="numeric"
                      style={{ ...inputBase, ...borderStyle('phone'), paddingLeft: 46 }} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: form.phone.length === 10 ? '#16a34a' : 'var(--ink-soft)', fontWeight: 600 }}>
                      {form.phone.length}/10
                    </span>
                  </div>
                </Field>

                {/* Email */}
                <Field label="Email (optional)" error={errors.email}>
                  <input type="email" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onBlur={() => touch('email')}
                    style={{ ...inputBase, ...borderStyle('email') }} />
                </Field>

                {/* Product */}
                <Field label="Product Interested In" error={errors.product}>
                  <input type="text" placeholder="e.g. Dasheri Mango, Desi Ghee…" value={form.product}
                    onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                    style={{ ...inputBase }} />
                </Field>

                {/* Message */}
                <Field label="Message" error={errors.message}>
                  <textarea rows={4} placeholder="Tell us what you need…" value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inputBase, resize: 'vertical' }} />
                </Field>

                <button type="submit" className="btn btn-forest btn-lg" disabled={sending}
                  style={{ opacity: sending ? 0.7 : 1, justifyContent: 'center', marginTop: 4 }}>
                  {sending ? 'Sending…' : 'Send Enquiry 🌿'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>
                  🔒 Your details are safe with us
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Order.js
export const Order = () => (
  <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--cream)', minHeight: '80vh' }}>
    <div style={{ background: 'var(--forest-deep)', padding: 'clamp(56px,7vw,88px) 0 clamp(44px,5vw,64px)' }}>
      <div className="container">
        <div className="eyebrow eyebrow-light" style={{ marginBottom: 14 }}>📦 Order</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,64px)', color: 'white', fontWeight: 600 }}>Order Now</h1>
        <p style={{ color: 'rgba(255,255,255,0.68)', marginTop: 12, fontSize: 16 }}>Browse our full catalog or call us for quick, custom orders.</p>
      </div>
    </div>

    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="grid-2" style={{ gap: 20, marginBottom: 40 }}>
          {[
            { icon:'🛒', title:'Shop Online',  desc:'Browse all products and checkout online', link:'/products', cta:'Browse Products' },
            { icon:'🥭', title:'Mangoes',      desc:'Explore all 7 mango varieties',           link:'/mangoes',  cta:'See Mangoes' },
            { icon:'📞', title:'Call Us',      desc:'7471145013 — quick orders by phone',      link:'tel:7471145013', cta:'Call Now', ext:true },
            { icon:'✉️', title:'Enquiry Form', desc:"Send us a message, we'll call back",      link:'/contact',  cta:'Send Message' },
          ].map((item, i) => (
            item.ext ? (
              <a key={i} href={item.link} style={{ textDecoration: 'none' }}>
                <div className="product-card" style={{ padding: 'clamp(20px,3vw,32px)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18, lineHeight: 1.65 }}>{item.desc}</p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--forest)' }}>{item.cta} →</span>
                </div>
              </a>
            ) : (
              <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                <div className="product-card" style={{ padding: 'clamp(20px,3vw,32px)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18, lineHeight: 1.65 }}>{item.desc}</p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--forest)' }}>{item.cta} →</span>
                </div>
              </Link>
            )
          ))}
        </div>

        <div style={{ background: 'var(--beige-warm)', borderRadius: 20, padding: 'clamp(24px,3.5vw,40px)', border: '1px solid var(--border-warm)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📞</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', marginBottom: 10 }}>Quick Order by Phone</h3>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 28, fontSize: 15 }}>Call us and our team will take your order and arrange delivery</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:7471145013" className="btn btn-forest btn-lg">📞 7471145013</a>
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-soft)' }}>Open daily · Until 8:30 PM · Samta Shopping Arcade</div>
        </div>
      </div>
    </section>
  </div>
);