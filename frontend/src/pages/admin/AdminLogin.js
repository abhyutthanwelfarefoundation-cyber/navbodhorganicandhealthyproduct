import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [slowMsg,  setSlowMsg]  = useState(false);
  const { login } = useAdmin();
  const navigate  = useNavigate();

  // Show "waking up server" message if login takes long (Render free tier cold start)
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setSlowMsg(true), 3000);
    } else {
      setSlowMsg(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handle = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Email and password required');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! 🌿');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const inp = {
    width: '100%', padding: '14px 16px 14px 44px', border: '1.5px solid #e2e8e3',
    borderRadius: 12, fontSize: 14.5, outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Jost', sans-serif", background: '#fafbfa', color: '#15201a',
    transition: 'border-color 0.2s, background 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: "'Jost', sans-serif", position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(circle at 20% 20%, #1f3322 0%, #0c160e 55%, #060b07 100%)',
    }}>
      {/* Decorative glow orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,212,150,0.18) 0%, transparent 70%)', filter: 'blur(10px)' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,213,176,0.12) 0%, transparent 70%)', filter: 'blur(10px)' }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 408,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderRadius: 26, padding: 'clamp(34px,5vw,46px) clamp(28px,5vw,40px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.1) inset',
        border: '1px solid rgba(255,255,255,0.6)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 58, height: 58, borderRadius: 18, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2d4a31 0%, #1a2c1c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, boxShadow: '0 10px 24px rgba(26,44,28,0.35)',
          }}>🌿</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: '#15201a', marginBottom: 4, letterSpacing: '-0.2px' }}>
            Navbodh Admin
          </h1>
          <p style={{ fontSize: 13, color: '#7c8c7d' }}>Sign in to manage your store</p>
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4a5a4b', marginBottom: 7 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.55 }}>✉️</span>
              <input type="email" placeholder="admin@navbodh.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={inp}
                onFocus={e => { e.target.style.borderColor = '#3a5c3f'; e.target.style.background = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8e3'; e.target.style.background = '#fafbfa'; }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#4a5a4b', marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.55 }}>🔒</span>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inp, paddingRight: 44 }}
                onFocus={e => { e.target.style.borderColor = '#3a5c3f'; e.target.style.background = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8e3'; e.target.style.background = '#fafbfa'; }}
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 4, lineHeight: 1, opacity: 0.7 }}
                tabIndex={-1}>
                {showPass ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '15px', marginTop: 6,
              background: loading ? '#5a6b5b' : 'linear-gradient(135deg, #2d4a31 0%, #1a2c1c 100%)',
              color: 'white', border: 'none', borderRadius: 13, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Jost', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: loading ? 'none' : '0 12px 28px rgba(26,44,28,0.35)',
              transition: 'all 0.2s',
            }}>
            {loading ? (
              <>
                <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>

          {slowMsg && (
            <div style={{
              fontSize: 12.5, color: '#8a6d2e', background: '#fdf6e3', border: '1px solid #f3e3ad',
              borderRadius: 10, padding: '10px 14px', textAlign: 'center', lineHeight: 1.5,
            }}>
              ⏳ Waking up the server — this can take up to 50 seconds on first login. Hang tight!
            </div>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11.5, color: '#a3afa4' }}>
          🔒 Navbodh Organics · Secure Admin Panel
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminLogin;