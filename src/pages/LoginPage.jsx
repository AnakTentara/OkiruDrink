import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useUser } from '../context/UserContext'
import '../styles/index.css'

export default function LoginPage() {
  const { login }  = useUser()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = login({ email: form.email, password: form.password })
    setLoading(false)
    if (result.ok) navigate('/', { replace: true })
    else setError(result.error)
  }

  return (
    <div className="auth-page">
      {/* Hero */}
      <motion.div
        className="auth-hero"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="/logo.jpg"
          alt="OkiruDrink"
          className="auth-logo-img"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
        />
        <span className="auth-brand">OkiruDrink</span>
        <span className="auth-sub">Healthy but Tasty 🌿</span>
      </motion.div>

      {/* Form card */}
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5 }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--neutral-900)', marginBottom: 4 }}>
            Masuk ke Akunmu
          </h2>
          <p style={{ fontSize: 13, color: 'var(--neutral-400)' }}>Selamat datang kembali! 👋</p>
        </div>

        {error && (
          <motion.div className="error-banner" style={{ marginBottom: 16 }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            {error}
          </motion.div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="login-email" className="input-field" type="email" name="email"
                placeholder="nama@email.com" value={form.email} onChange={handleChange}
                required autoComplete="email" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock size={16} className="input-icon" />
              <input id="login-password" className="input-field"
                type={showPw ? 'text' : 'password'} name="password"
                placeholder="Masukkan password" value={form.password} onChange={handleChange}
                required autoComplete="current-password" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', display: 'flex' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 8, gap: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Memproses...' : <><span>Masuk</span> <ArrowRight size={18} /></>}
          </motion.button>
        </form>
      </motion.div>

      <motion.p
        className="auth-footer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
      >
        Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
      </motion.p>
    </div>
  )
}
