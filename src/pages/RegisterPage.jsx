import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronLeft, ArrowRight } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function RegisterPage() {
  const { register } = useUser()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Password dan konfirmasi tidak sama.'); return }
    if (form.password.length < 6)       { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    setLoading(false)
    if (result.ok) navigate('/otp')
    else setError(result.error)
  }

  return (
    <div className="auth-page">
      {/* Back btn */}
      <motion.div
        style={{ paddingTop: 16, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--neutral-600)', fontFamily: 'var(--font)',
            fontSize: 14, fontWeight: 700, padding: '8px 0' }}>
          <ChevronLeft size={18} /> Kembali
        </button>
      </motion.div>

      {/* Hero */}
      <motion.div className="auth-hero"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ paddingTop: 20, paddingBottom: 20 }}
      >
        <motion.img src="/logo.jpg" alt="OkiruDrink" className="auth-logo-img"
          style={{ width: 80, height: 80 }}
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        />
        <span className="auth-brand" style={{ fontSize: 20 }}>Buat Akun Baru</span>
        <span className="auth-sub">Bergabung dengan OkiruDrink 🌿</span>
      </motion.div>

      {/* Form card */}
      <motion.div className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45 }}
      >
        {error && (
          <motion.div className="error-banner" style={{ marginBottom: 14 }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            {error}
          </motion.div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Nama Lengkap</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input id="reg-name" className="input-field" type="text" name="name"
                placeholder="Contoh: Budi Utama" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="reg-email" className="input-field" type="email" name="email"
                placeholder="nama@email.com" value={form.email} onChange={handleChange}
                required autoComplete="email" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">No. WhatsApp</label>
            <div className="input-wrapper">
              <Phone size={16} className="input-icon" />
              <input id="reg-phone" className="input-field" type="tel" name="phone"
                placeholder="08xxxxxxxxxx" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock size={16} className="input-icon" />
              <input id="reg-password" className="input-field"
                type={showPw ? 'text' : 'password'} name="password"
                placeholder="Min. 6 karakter" value={form.password}
                onChange={handleChange} required style={{ paddingRight: 44 }}
                autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--neutral-400)', display: 'flex' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Konfirmasi Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="reg-confirm" className="input-field" type="password" name="confirm"
                placeholder="Ulangi password" value={form.confirm}
                onChange={handleChange} required autoComplete="new-password" />
            </div>
          </div>

          <motion.button id="reg-submit" type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading} style={{ marginTop: 6, gap: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Mendaftar...' : <><span>Daftar Sekarang</span><ArrowRight size={18} /></>}
          </motion.button>
        </form>
      </motion.div>

      <motion.p className="auth-footer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </motion.p>
    </div>
  )
}
