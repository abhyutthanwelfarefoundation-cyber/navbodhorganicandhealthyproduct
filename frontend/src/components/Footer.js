import React from 'react';
import { Link } from 'react-router-dom';

let LogoImg = null;
// try { LogoImg = require('../assets/logo2.png'); } catch {}

const Footer = () => (
  <footer style={{ background: '#1e2b1f', color: 'white', paddingTop: 'clamp(48px,7vw,80px)' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 'clamp(28px,4vw,48px)', paddingBottom: 52 }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            {/* {LogoImg
              ? <img src={LogoImg} alt="Navbodh" style={{ height: 44, filter: 'brightness(4)' }} />
              : <span style={{ fontSize: 28 }}>🌿</span>} */}
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>Navbodh</div>
              <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 , color: 'white', }}>Organic & Healthy Products</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.65, maxWidth: 220 }}>
            Premium organic produce sourced from the heart of nature — delivered fresh across Raipur.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <a href="tel:7471145013" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.09)', borderRadius: 8, padding: '9px 14px', fontSize: 13, fontWeight: 600 }}>
              📞 7471145013
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 18, color: 'var(--beige)' }}>Explore</div>
          {[
            { to: '/',         label: 'Home' },
            { to: '/mangoes',  label: 'Mango Varieties' },
            { to: '/products', label: 'All Products' },
            { to: '/why-us',   label: 'Why Navbodh?' },
            { to: '/order',    label: 'Order Now' },
            { to: '/contact',  label: 'Contact Us' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 13, opacity: 0.65, marginBottom: 10, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.65}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Products */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 18, color: 'var(--beige)' }}>Our Products</div>
          {['🥭 Dasheri Mango','🥭 Langda','🥭 Amrapali','🥭 Mallika','🧈 Pure Desi Ghee','🥛 Fresh Milk','🍈 Jackfruit','🌰 Kaju'].map(p => (
            <div key={p} style={{ fontSize: 13, opacity: 0.65, marginBottom: 8 }}>{p}</div>
          ))}
        </div>

        {/* Visit */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 18, color: 'var(--beige)' }}>Visit Us</div>
          <div style={{ fontSize: 13, lineHeight: 1.9, opacity: 0.7 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, opacity: 1, marginBottom: 3 }}>📍 Address</div>
    
              Okinawa Showroom Buliding , 1st Floor , Bangrang Nagar Main Rd, Raipur Chhattisgarh 492001
    
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, opacity: 1, marginBottom: 3 }}>📞 Phone</div>
              <a href="tel:7471145013" style={{ display: 'block' }}>7471145013</a>
            </div>
            <div>
              <div style={{ fontWeight: 700, opacity: 1, marginBottom: 3 }}>🕐 Hours</div>
              Open daily until 6:30 PM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 , color: 'white'}}>
        <div style={{ fontSize: 12, opacity: 0.4 }}>© 2026 Navbodh Organic & Healthy Products. All Rights Reserved</div>
        <div style={{ fontSize: 12, opacity: 0.4 }}>Developed by <a href="https://namanjainottportfolio.netlify.app/"> <b>Naman Jain</b></a> </div>
      </div>
    </div>
  </footer>
);

export default Footer; 