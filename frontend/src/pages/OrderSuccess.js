import React, { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get('id')     || 'NVB-XXXXXX';
  const name    = params.get('name')   || 'Customer'; 
  const phone   = params.get('phone')  || '';
  const total   = params.get('total')  || '0';
  const method  = params.get('method') || 'upi';
  const txn     = params.get('txn')    || '';
  const date    = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const invoiceRef = useRef(null);

  const printInvoice = () => {
    const content = invoiceRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #1a1a1a; }
            .invoice-wrap { max-width: 680px; margin: 0 auto; padding: 40px 32px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #1a2c1c; }
            .brand-name { font-size: 24px; font-weight: 800; color: #1a2c1c; letter-spacing: -0.5px; }
            .brand-tag { font-size: 11px; color: #666; margin-top: 3px; letter-spacing: 0.1em; text-transform: uppercase; }
            .invoice-title { font-size: 13px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.1em; text-align: right; }
            .invoice-id { font-size: 22px; font-weight: 800; color: #1a2c1c; text-align: right; margin-top: 4px; }
            .invoice-date { font-size: 12px; color: #888; text-align: right; margin-top: 3px; }
            .section { margin-bottom: 28px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-box { background: #f8f5ef; border-radius: 10px; padding: 16px; }
            .info-label { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
            .info-value { font-size: 14px; color: #1a1a1a; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            th { background: #1a2c1c; color: white; padding: 10px 14px; font-size: 12px; font-weight: 700; text-align: left; }
            td { padding: 11px 14px; font-size: 13px; border-bottom: 1px solid #f0ece4; }
            tr:last-child td { border-bottom: none; }
            .total-row { background: #f8f5ef; }
            .total-row td { font-weight: 800; font-size: 16px; padding: 14px; }
            .amount { text-align: right; }
            .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e8e0d0; text-align: center; font-size: 11px; color: #888; line-height: 1.8; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; }
            .paid { background: #dcfce7; color: #166534; }
            .pending { background: #fef9c3; color: #854d0e; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Success banner */}
      <div style={{ background: 'var(--forest-deep)', padding: 'clamp(40px,6vw,72px) 0', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', color: 'white', marginBottom: 10 }}>
          Order Placed!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 20 }}>
          Thank you {name}! We'll confirm and deliver your order shortly.
        </p>
        <div style={{ display: 'inline-block', background: 'rgba(232,213,176,0.15)', border: '1px solid rgba(232,213,176,0.3)', borderRadius: 12, padding: '12px 28px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Order ID</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--beige)' }}>
            #{String(orderId).slice(-6).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(28px,4vw,48px) 28px', maxWidth: 720 }}>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <button onClick={printInvoice}
            style={{ flex: 1, minWidth: 180, padding: '14px 20px', background: 'var(--forest-deep)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            🧾 Download Invoice
          </button>
          <a href="tel:7471145013"
            style={{ flex: 1, minWidth: 180, padding: '14px 20px', background: 'white', color: 'var(--forest-deep)', border: '2px solid var(--forest)', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
            📞 Call Us
          </a>
          <Link to="/products"
            style={{ flex: 1, minWidth: 180, padding: '14px 20px', background: 'var(--beige-warm)', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
            🛍 Shop More
          </Link>
        </div>

        {/* Invoice preview */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div ref={invoiceRef} className="invoice-wrap" style={{ padding: 'clamp(24px,4vw,40px)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 20, borderBottom: '2px solid #1a2c1c' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1a2c1c', letterSpacing: '-0.5px' }}>🌿 NAVBODH ORGANICS</div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pure · Natural · Sustainable</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 6, lineHeight: 1.6 }}>
                  Bangrang Nagar Main Rd, Raipur CG<br />
                  📞 +91 74711 45013 · UPI: Q12720464@ybl
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Invoice</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1a2c1c', marginTop: 4 }}>#{String(orderId).slice(-6).toUpperCase()}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{date}</div>
              </div>
            </div>

            {/* Bill to + Payment info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#f8f5ef', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Bill To</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a2c1c' }}>{name}</div>
                {phone && <div style={{ fontSize: 13, color: '#555', marginTop: 3 }}>📞 {phone}</div>}
              </div>
              <div style={{ background: '#f8f5ef', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Payment</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2c1c', marginBottom: 4 }}>
                  {method === 'cod' ? '💵 Cash on Delivery' : '📱 UPI Payment'}
                </div>
                <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: method === 'upi' ? '#dcfce7' : '#fef9c3', color: method === 'upi' ? '#166534' : '#854d0e' }}>
                  {method === 'upi' ? '✓ Paid' : '⏳ Pay on Delivery'}
                </div>
                {txn && <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Txn: {txn}</div>}
              </div>
            </div>

            {/* Items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr style={{ background: '#1a2c1c' }}>
                  <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'white', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'white', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'white', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: 'white', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ padding: '10px 14px', fontSize: 13, color: '#555', borderBottom: '1px solid #f0ece4' }}>
                    🛍 Order items (see order #{String(orderId).slice(-6).toUpperCase()})
                  </td>
                </tr>
                <tr style={{ background: '#f8f5ef' }}>
                  <td colSpan={3} style={{ padding: '14px', fontWeight: 800, fontSize: 15 }}>Grand Total</td>
                  <td style={{ padding: '14px', fontWeight: 800, fontSize: 18, textAlign: 'right', color: '#1a2c1c' }}>₹{total}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ padding: '8px 14px', fontSize: 12, color: '#888' }}>Delivery Charges</td>
                  <td style={{ padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#166534', textAlign: 'right' }}>Depends On Distance  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid #e8e0d0', textAlign: 'center', fontSize: 11, color: '#999', lineHeight: 1.8 }}>
              Thank you for choosing Navbodh Organics 🌿<br />
              Pure · Natural · Sustainable · Raipur, Chhattisgarh<br />
              For queries: +91 74711 45013 · navbodhorga  nics@gmail.com
            </div>
          </div>  
        </div>
<div style={{ marginTop: 28 }}>
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)',
      marginBottom: 12,
      textAlign:'center'
    }}
  >
    Follow Us
  </div>

  <div
    style={{
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}
  >
    <a
      href="https://www.instagram.com/navbodh_organic/"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline"
    >
      📸 Instagram
    </a>

    <a
      href="https://www.facebook.com/profile.php?id=61590378151350"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline"
    >
      📘 Facebook
    </a>

    <a
      href="https://wa.me/917471145013"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline"
    >
      💬 WhatsApp
    </a>
  </div>
</div>
      </div>
    </div>
  );
};

export default OrderSuccess;