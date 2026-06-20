import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const STATUS_OPTIONS = ['placed', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
const STATUS_COLOR = {
  placed:     { bg: '#fef3c7', color: '#d97706' },
  confirmed:  { bg: '#dbeafe', color: '#2563eb' },
  packed:     { bg: '#ede9fe', color: '#7c3aed' },
  dispatched: { bg: '#cffafe', color: '#0891b2' },
  delivered:  { bg: '#dcfce7', color: '#16a34a' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

const AdminOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await axios.get(`${API_URL}/orders${params}`);
      setOrders(res.data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter(o =>
    !search ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.phone?.includes(search) ||
    o._id?.toString().slice(-6).toUpperCase().includes(search.toUpperCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: '#111827', marginBottom: 4 }}>Orders</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '7px 16px', borderRadius: 100, border: '1.5px solid', borderColor: filter === s ? '#1a2c1c' : '#e5e7eb', background: filter === s ? '#1a2c1c' : 'white', color: filter === s ? 'white' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)' }}>
            {s}
          </button>
        ))}
        <input placeholder="Search name, phone, ID…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 100, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)', minWidth: 200 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>

        {/* Orders table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>Loading orders…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>No orders found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => {
                    const sc = STATUS_COLOR[order.status] || STATUS_COLOR.placed;
                    const isSelected = selected?._id === order._id;
                    return (
                      <tr key={order._id}
                        style={{ borderTop: '1px solid #f3f4f6', background: isSelected ? '#f0fdf4' : 'white', cursor: 'pointer' }}
                        onClick={() => setSelected(isSelected ? null : order)}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#1a2c1c', whiteSpace: 'nowrap' }}>
                          #{order._id?.toString().slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{order.customer?.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.customer?.phone}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700 }}>₹{order.total}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: order.paymentMethod === 'upi' ? '#dcfce7' : '#fef3c7', color: order.paymentMethod === 'upi' ? '#16a34a' : '#d97706', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                            {order.paymentMethod?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                          <select value={order.status}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12, fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none' }}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order detail panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#111827' }}>
                #{selected._id?.toString().slice(-6).toUpperCase()}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {/* Customer */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Customer</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{selected.customer?.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>📞 {selected.customer?.phone}</div>
              {selected.customer?.email && <div style={{ fontSize: 13, color: '#6b7280' }}>✉️ {selected.customer.email}</div>}
              {selected.customer?.address && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>📍 {selected.customer.address}, {selected.customer.city}</div>}
            </div>

            {/* Items */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Items</div>
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>{item.emoji} {item.name} × {item.quantity} {item.unit}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, fontSize: 15 }}>
                <span>Total</span>
                <span style={{ color: '#1a2c1c' }}>₹{selected.total}</span>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Payment</div>
              <div style={{ fontSize: 13, color: '#374151' }}>Method: <strong>{selected.paymentMethod?.toUpperCase()}</strong></div>
              {selected.txnId && <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>Txn ID: <strong>{selected.txnId}</strong></div>}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div style={{ background: '#fffbeb', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #fde68a' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#d97706', marginBottom: 4 }}>Notes</div>
                <div style={{ fontSize: 13, color: '#374151' }}>{selected.notes}</div>
              </div>
            )}

            {/* Update status */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Update Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUS_OPTIONS.map(s => {
                  const sc = STATUS_COLOR[s];
                  const isActive = selected.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      style={{ padding: '9px 14px', borderRadius: 10, border: `1.5px solid ${isActive ? sc.color : '#e5e7eb'}`, background: isActive ? sc.bg : 'white', color: isActive ? sc.color : '#6b7280', fontSize: 13, fontWeight: isActive ? 700 : 500, cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
                      {isActive ? '✓ ' : ''}{s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders; 