import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useUserStore } from '../store/useUserStore'
import '../styles/index.css'

// Floating leaf particles
const LEAVES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  emoji: ['🍃', '🌿', '☘️', '🍃', '🌱', '🍀'][i],
  left: `${15 + i * 14}%`,
  delay: i * 0.8,
  duration: 6 + Math.random() * 4,
  size: 14 + Math.random() * 10,
}))

const loginApi = async (data) => {
  const res = await fetch('http://localhost:2027/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error)
  return json
}

export default function LoginPage() {
  const { setUser } = useUserStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('okiru_token', data.token)
      setUser(data.user)
      toast.success('Login berhasil! Selamat datang kembali.')
      navigate('/', { replace: true })
    },
    onError: (err) => {
      toast.error(err.message || 'Login gagal. Coba lagi.')
    }
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email: form.email, password: form.password })
  }

  const handleSocialLogin = () => {
    toast('Login dengan Google/Apple akan segera hadir!', { icon: '🚧' })
  }

  return (
    <div className="auth-page">
      {/* Floating Particles */}
      <div className="auth-particles" aria-hidden>
        {LEAVES.map(leaf => (
          <motion.span
            key={leaf.id}
            className="auth-leaf"
            style={{ left: leaf.left, fontSize: leaf.size }}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, Math.sin(leaf.id) * 30],
              rotate: [0, 360],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {leaf.emoji}
          </motion.span>
        ))}
      </div>

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="login-email" className="input-field" type="email" name="email"
                placeholder="nama@email.com" value={form.email} onChange={handleChange}
                required autoComplete="email" disabled={loginMutation.isPending} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock size={16} className="input-icon" />
              <input id="login-password" className="input-field"
                type={showPw ? 'text' : 'password'} name="password"
                placeholder="Masukkan password" value={form.password} onChange={handleChange}
                required autoComplete="current-password" style={{ paddingRight: 44 }} disabled={loginMutation.isPending} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)', display: 'flex' }}
                disabled={loginMutation.isPending}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loginMutation.isPending}
            style={{ marginTop: 8, gap: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            {loginMutation.isPending ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >Memproses...</motion.span>
            ) : (
              <><span>Masuk</span> <ArrowRight size={18} /></>
            )}
          </motion.button>

          {/* Social Login Divider */}
          <div className="auth-divider">atau masuk dengan</div>

          {/* Social Buttons */}
          <div className="social-btns">
            <motion.button
              type="button"
              className="social-btn"
              onClick={() => handleSocialLogin('Google')}
              disabled={loginMutation.isPending}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Google</span>
            </motion.button>
            <motion.button
              type="button"
              className="social-btn"
              onClick={() => handleSocialLogin('Apple')}
              disabled={loginMutation.isPending}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <span>Apple</span>
            </motion.button>
          </div>
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
