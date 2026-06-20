import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import { MdDashboard, MdShoppingBag, MdInventory, MdLogout, MdMenu, MdClose, MdStore } from 'react-icons/md';

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard',  icon: <MdDashboard size={20} /> },
  { path: '/admin/orders',    label: 'Orders',      icon: <MdShoppingBag size={20} /> },
  { path: '/admin/products',  label: 'Products',    icon: <MdInventory size={20} /> },
];

const AdminLayout = () => {
  const { admin, logout }  = useAdmin();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [open, setOpen]    = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <div style={{ width: 240, background: '#0f1f11', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e8d5b0', fontFamily: 'var(--font-display)' }}>🌿 Navbodh</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Admin Dashboard</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV.map(n => {
          const active = location.pathname === n.path;
          return (
            <Link key={n.path} to={n.path} onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', background: active ? 'rgba(232,213,176,0.12)' : 'transparent', color: active ? '#e8d5b0' : 'rgba(255,255,255,0.55)', fontWeight: active ? 700 : 500, fontSize: 14, transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              {n.icon} {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Visit site + logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a href="https://www.navbodhorganic.com" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', marginBottom: 4 }}>
          <MdStore size={18} /> Visit Store
        </a>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 10, background: 'transparent', border: 'none', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <MdLogout size={18} /> Logout
        </button>
        <div style={{ padding: '10px 14px', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          {admin?.name || admin?.email}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Desktop sidebar */}
      <div className="hide-mobile"><Sidebar /></div>

      {/* Mobile sidebar */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 101 }}><Sidebar /></div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar (mobile) */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }} className="hide-desktop">
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}>
            <MdMenu size={24} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1a2c1c' }}>🌿 Admin</span>
        </div>

        <div style={{ flex: 1, padding: 'clamp(16px,3vw,32px)', overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;