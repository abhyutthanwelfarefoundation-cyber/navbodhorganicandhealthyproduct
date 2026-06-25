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

const printInvoice = (order) => {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const orderId = order._id?.toString().slice(-6).toUpperCase();
  const itemsRows = (order.items || []).map(i => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0ece4;">${i.emoji || ''} ${i.name}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0ece4;text-align:center;">${i.quantity} ${i.unit}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0ece4;text-align:right;">₹${i.price}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0ece4;text-align:right;">₹${i.price * i.quantity}</td>
    </tr>
  `).join('');

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Invoice #${orderId} - Navbodh Organics</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Segoe UI',Arial,sans-serif; background:white; color:#1a1a1a; }
          .wrap { max-width:680px; margin:0 auto; padding:40px 32px; }
          .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:20px; border-bottom:2px solid #1a2c1c; }
          .brand { font-size:22px; font-weight:800; color:#1a2c1c; }
          .brand-sub { font-size:10px; color:#666; margin-top:3px; letter-spacing:0.1em; text-transform:uppercase; }
          .brand-info { font-size:12px; color:#888; margin-top:6px; line-height:1.6; }
          .inv-right { text-align:right; }
          .inv-label { font-size:11px; font-weight:700; color:#888; text-transform:uppercase; letter-spacing:0.1em; }
          .inv-id { font-size:20px; font-weight:800; color:#1a2c1c; margin-top:4px; }
          .inv-date { font-size:12px; color:#888; margin-top:3px; }
          .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
          .box { background:#f8f5ef; border-radius:10px; padding:16px; }
          .box-label { font-size:10px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }
          .box-val { font-size:14px; color:#1a1a1a; font-weight:700; }
          .box-sub { font-size:12px; color:#555; margin-top:3px; }
          table { width:100%; border-collapse:collapse; margin-bottom:8px; }
          th { background:#1a2c1c; color:white; padding:10px 14px; font-size:12px; font-weight:700; text-align:left; }
          th.r { text-align:right; } th.c { text-align:center; }
          .total-row td { background:#f8f5ef; font-weight:800; font-size:15px; padding:14px; }
          .footer { margin-top:28px; padding-top:18px; border-top:1px solid #e8e0d0; text-align:center; font-size:11px; color:#999; line-height:1.8; }
          .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:700; }
          .paid { background:#dcfce7; color:#166534; }
          .pending { background:#fef9c3; color:#854d0e; }
          @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="header">
            <div>
              <div class="brand">🌿 NAVBODH ORGANICS</div>
              <div class="brand-sub">Pure · Natural · Sustainable</div>
              <div class="brand-info">Bangrang Nagar Main Rd, Raipur CG<br/>📞 +91 74711 45013 · UPI: Q12720464@ybl</div>
            </div>
            <div class="inv-right">
              <div class="inv-label">Invoice</div>
              <div class="inv-id">#${orderId}</div>
              <div class="inv-date">${date}</div>
            </div>
          </div>
          <div class="grid2">
            <div class="box">
              <div class="box-label">Bill To</div>
              <div class="box-val">${order.customer?.name || '—'}</div>
              <div class="box-sub">📞 ${order.customer?.phone || '—'}</div>
              ${order.customer?.email ? `<div class="box-sub">✉️ ${order.customer.email}</div>` : ''}
              ${order.customer?.address ? `<div class="box-sub">📍 ${order.customer.address}, ${order.customer.city || 'Raipur'}</div>` : ''}
            </div>
            <div class="box">
              <div class="box-label">Payment</div>
              <div class="box-val">${order.paymentMethod === 'upi' ? '📱 UPI Payment' : '💵 Cash on Delivery'}</div>
              <div style="margin-top:6px;"><span class="badge ${order.paymentMethod === 'upi' ? 'paid' : 'pending'}">${order.paymentMethod === 'upi' ? '✓ Paid' : '⏳ Pay on Delivery'}</span></div>
              ${order.txnId ? `<div class="box-sub" style="margin-top:4px;">Txn: ${order.txnId}</div>` : ''}
            </div>
          </div>
          <table>
            <thead><tr><th>Item</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
            <tbody>
              ${itemsRows}
              <tr class="total-row"><td colspan="3">Grand Total</td><td style="text-align:right;font-size:18px;color:#1a2c1c;">₹${order.total}</td></tr>
              <tr><td colspan="3" style="padding:8px 14px;font-size:12px;color:#888;">Delivery Charges</td><td style="padding:8px 14px;font-size:12px;font-weight:700;color:#166534;text-align:right;">Depends on Distance</td></tr>
            </tbody>
          </table>
          ${order.notes ? `<div style="margin-top:16px;padding:12px 16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;font-size:13px;color:#374151;"><strong>Notes:</strong> ${order.notes}</div>` : ''}
          <div class="footer">Thank you for choosing Navbodh Organics 🌿<br/>Pure · Natural · Sustainable · Raipur, Chhattisgarh<br/>For queries: +91 74711 45013 · navbodhorganics@gmail.com</div>
        </div>
      </body>
    </html>
  `);
  win.document.close();
  setTimeout(() => { win.print(); }, 400);
};

const AdminOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
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
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 100, border: '1.5px solid', borderColor: filter === s ? '#1a2c1c' : '#e5e7eb', background: filter === s ? '#1a2c1c' : 'white', color: filter === s ? 'white' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
            {s}
          </button>
        ))}
        <input placeholder="Search name, phone, ID…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 100, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)', minWidth: 180 }} />
      </div>

      {/* Layout — stacked when detail panel open on small screens */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Orders table */}
        <div style={{ flex: 1, minWidth: 0, background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
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
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? '#f0fdf4' : 'white'; }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#1a2c1c', whiteSpace: 'nowrap' }}>
                          #{order._id?.toString().slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{order.customer?.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.customer?.phone}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>₹{order.total}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: order.paymentMethod === 'upi' ? '#dcfce7' : '#fef3c7', color: order.paymentMethod === 'upi' ? '#16a34a' : '#d97706', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
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
          <div style={{ width: 340, flexShrink: 0, background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, position: 'sticky', top: 20, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: '#111827' }}>
                #{selected._id?.toString().slice(-6).toUpperCase()}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
            </div>

            {/* Invoice button */}
            <button onClick={() => printInvoice(selected)}
              style={{ width: '100%', padding: '10px', marginBottom: 16, background: '#1a2c1c', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              🧾 Download / Print Invoice
            </button>

            {/* Customer */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Customer</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{selected.customer?.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>📞 {selected.customer?.phone}</div>
              {selected.customer?.email && <div style={{ fontSize: 13, color: '#6b7280' }}>✉️ {selected.customer.email}</div>}
              {selected.customer?.address && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>📍 {selected.customer.address}, {selected.customer.city}</div>}
            </div>

            {/* Items */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Items</div>
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: 13, color: '#374151' }}>{item.emoji} {item.name} × {item.quantity} {item.unit}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 8 }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, fontSize: 14 }}>
                <span>Total</span>
                <span style={{ color: '#1a2c1c' }}>₹{selected.total}</span>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>Payment</div>
              <div style={{ fontSize: 13, color: '#374151' }}>Method: <strong>{selected.paymentMethod?.toUpperCase()}</strong></div>
              {selected.txnId && <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>Txn ID: <strong>{selected.txnId}</strong></div>}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div style={{ background: '#fffbeb', borderRadius: 12, padding: 14, marginBottom: 14, border: '1px solid #fde68a' }}>
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
                      style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${isActive ? sc.color : '#e5e7eb'}`, background: isActive ? sc.bg : 'white', color: isActive ? sc.color : '#6b7280', fontSize: 13, fontWeight: isActive ? 700 : 500, cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}>
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