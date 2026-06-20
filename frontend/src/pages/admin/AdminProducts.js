import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const EMPTY = { name: '', category: 'mango', emoji: '🥭', origin: '', badge: '', description: '', price: '', unit: 'kg', featured: false, inStock: true, tags: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch { toast.error('Failed to load products'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, tags: (p.tags || []).join(', '), price: p.price || '' });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return toast.error('Name and description required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await axios.put(`${API_URL}/products/${editing._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API_URL}/products`, payload);
        toast.success('Product added!');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const toggleStock = async (p) => {
    try {
      await axios.put(`${API_URL}/products/${p._id}`, { ...p, inStock: !p.inStock });
      setProducts(prev => prev.map(x => x._id === p._id ? { ...x, inStock: !x.inStock } : x));
      toast.success(`${p.name} marked as ${!p.inStock ? 'In Stock' : 'Out of Stock'}`);
    } catch { toast.error('Failed to update'); }
  };

  const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box', background: '#f9fafb' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: '#111827', marginBottom: 4 }}>Products</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{products.length} products</p>
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1a2c1c', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <MdAdd size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>Loading products…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 28 }}>{p.emoji}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)}
                      style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2563eb' }}>
                      <MdEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.name)}
                      style={{ width: 32, height: 32, borderRadius: 8, background: '#fee2e2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8, textTransform: 'capitalize' }}>{p.category} · {p.origin}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a2c1c', marginBottom: 12 }}>
                  {p.price ? `₹${p.price}/${p.unit}` : 'Enquire'}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => toggleStock(p)}
                    style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none', background: p.inStock ? '#dcfce7' : '#fee2e2', color: p.inStock ? '#16a34a' : '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                  </button>
                  {p.featured && <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>Featured</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={closeModal}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#111827' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <MdClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Name *</label>
                  <input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Emoji</label>
                  <input style={inp} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🥭" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Category</label>
                  <select style={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['mango', 'dairy', 'fruit', 'nut', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Origin</label>
                  <input style={inp} value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} placeholder="Uttar Pradesh" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Price (₹)</label>
                  <input style={inp} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="180" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Unit</label>
                  <select style={inp} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {['kg', '500ml', '1L', 'litre', 'piece', 'dozen', 'box'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Badge</label>
                <input style={inp} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="A2 Quality, Sweet & Fibrous…" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Description *</label>
                <textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description…" required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Tags (comma separated)</label>
                <input style={inp} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="sweet, organic, bestseller" />
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#1a2c1c' }} />
                  In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#1a2c1c' }} />
                  Featured
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={closeModal}
                  style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 2, padding: '12px', background: saving ? '#6b7280' : '#1a2c1c', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
                  {saving ? 'Saving…' : editing ? '✓ Update Product' : '+ Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;   