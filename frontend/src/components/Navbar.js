import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ReactComponent as MangoIcon } from '../assets/mango.svg';
import {
  GiLeafSwirl,
} from 'react-icons/gi';
import {
  HiOutlineShoppingCart, HiMenu, HiX,
} from 'react-icons/hi';
import {
  MdStorefront, MdInfoOutline, MdLocationOn, MdPhone,
  MdPhoto,
} from 'react-icons/md';
import { IoLeafOutline } from 'react-icons/io5';
import { BsBoxSeam } from 'react-icons/bs';

let LogoImg = null;
try { LogoImg = require('../assets/lemon.png'); } catch {}

const LINKS = [
  { to: '/',         label: 'Home',     Icon: MdStorefront   },
  { to: '/products', label: 'Products', Icon: IoLeafOutline  },
  { to: '/gallery',  label: 'Gallery',  Icon: MdPhoto   },
  { to: '/mangoes',  label: 'Mangoes',  Icon: MangoIcon       },  
  { to: '/why-us',   label: 'Why Us',   Icon: MdInfoOutline  },
  { to: '/contact',  label: 'Contact',  Icon: MdLocationOn   },

];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const { count } = useCart();
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (p) => p === '/' ? loc.pathname === '/' : loc.pathname.startsWith(p);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
            {/* {LogoImg
              ? <img src={LogoImg} alt="Navbodh Organic" />
              : <GiLeafSwirl size={36} color="var(--forest)" />
            } */}
            <div className="nav-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="nav-logo-name">Navbodh</span>
              <span className="nav-logo-tag">Organic &amp; Healthy Products</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to} className={`nav-link${isActive(to) ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon style={{ width: 14, height: 14 }} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="nav-right">
            <Link to="/cart" className="cart-btn" aria-label="Cart">
              <HiOutlineShoppingCart size={20} />
              {count > 0 && <span className="cart-badge">{count > 9 ? '9+' : count}</span>}
            </Link>
            <Link to="/order" className="btn btn-forest btn-sm hide-tablet"
              style={{ borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BsBoxSeam size={13} />
              Order Now
            </Link>
            <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, top: 'var(--nav-h)', background: 'rgba(0,0,0,0.30)', zIndex: 998 }} />
          <div className="mobile-drawer">
            {LogoImg && (
              <div style={{ padding: '14px 28px 10px', borderBottom: '1px solid var(--forest-mist)', display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* <img src={LogoImg} alt="Navbodh" style={{ height: 36 }} /> */}
                <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>Raipur, Chhattisgarh</span>
              </div>
            )}
            {LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to}
                className={`drawer-link${isActive(to) ? ' active' : ''}`}
                onClick={() => setOpen(false)}>
                <Icon
  style={{ width: 20, height: 20, flexShrink: 0 }}
  color={isActive(to) ? 'var(--forest)' : 'var(--ink-soft)'}
/>
                {label}
                {isActive(to) && (
                  <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--forest)', display: 'block' }} />
                )}
              </Link>
            ))}
            <div className="drawer-footer">
              <Link to="/order" className="btn btn-forest"
                style={{ flex: 1, fontSize: 14, display: 'flex', alignItems: 'center', gap: 7 }}
                onClick={() => setOpen(false)}>
                <BsBoxSeam size={14} /> Order Now
              </Link>
              <a href="tel:07714040459" className="btn btn-outline"
                style={{ flex: 1, fontSize: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                <MdPhone size={16} /> Call Us
              </a>
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <a href="tel:7471145013" className="fab-call"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MdPhone size={18} />
        Call Us Now
      </a>
    </>
  );
};

export default Navbar;