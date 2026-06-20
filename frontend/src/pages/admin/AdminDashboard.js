import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdAttachMoney, MdPendingActions, MdToday } from 'react-icons/md';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const StatCard = ({ icon, label, value, color, link }) => (
  <Link to={link || '#'} style={{ textDecoration: 'none' }}>
    <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16, transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  </Link>
);

const STATUS_COLOR = {
  placed:     { bg: '#fef3c7', color: '#d97706' },
  confirmed:  { bg: '#dbeafe', color: '#2563eb' },
  packed:     { bg: '#ede9fe', color: '#7c3aed' },
  dispatched: { bg: '#cffafe', color: '#0891b2' },
  delivered:  { bg: '#dcfce7', color: '#16a34a' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

const AdminDashboard = () => {
  const [stats,  setStats]  = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/orders/stats`),
          axios.get(`${API_URL}/orders?limit=5`),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}>🌿</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: '#111827', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<MdShoppingBag size={24}/>}    label="Total Orders"   value={stats?.totalOrders   || 0}            color="#7c3aed" link="/admin/orders" />
        <StatCard icon={<MdToday size={24}/>}          label="Today's Orders" value={stats?.todayOrders   || 0}            color="#0891b2" link="/admin/orders" />
        <StatCard icon={<MdAttachMoney size={24}/>}    label="Total Revenue"  value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color="#16a34a" />
        <StatCard icon={<MdPendingActions size={24}/>} label="Pending"        value={stats?.pendingOrders || 0}            color="#d97706" link="/admin/orders" />
      </div>

      {/* Recent orders */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#111827' }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ fontSize: 13, fontWeight: 600, color: '#1a2c1c', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Order ID', 'Customer', 'Phone', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No orders yet</td></tr>
              ) : orders.map(order => {
                const sc = STATUS_COLOR[order.status] || STATUS_COLOR.placed;
                return (
                  <tr key={order._id} style={{ borderTop: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#1a2c1c', whiteSpace: 'nowrap' }}>#{order._id?.toString().slice(-6).toUpperCase()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{order.customer?.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{order.customer?.phone}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#111827' }}>₹{order.total}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12 }}>
                      <span style={{ background: order.paymentMethod === 'upi' ? '#dcfce7' : '#fef3c7', color: order.paymentMethod === 'upi' ? '#16a34a' : '#d97706', padding: '3px 10px', borderRadius: 100, fontWeight: 700 }}>
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;