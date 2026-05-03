import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronLeft, ArrowRight, Check, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import '../styles/index.css'

function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  if (!password) return null

  const labels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  const colors = ['#E05252', '#F5A623', '#F5A623', '#2ECC71', '#1B9A5A']
  const label = labels[Math.min(strength, 4)]
  const color = colors[Math.min(strength, 4)]

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < strength ? 1 : 0.3 }}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < strength ? color : 'var(--neutral-200)',
              transformOrigin: 'left',
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color, margin: 0 }}>{label}</p>
    </div>
  )
}

const registerApi = async (data) => {
  const res = await fetch('http://localhost:2027/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error)
  return json
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      // In a real app we'd save token or go to OTP
      toast.success('Pendaftaran berhasil! Silakan verifikasi OTP.')
      navigate('/otp')
    },
    onError: (err) => {
      toast.error(err.message || 'Pendaftaran gagal.')
    }
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Password dan konfirmasi tidak sama.'); return }
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter.'); return }
    registerMutation.mutate({ name: form.name, email: form.email, phone: form.phone, password: form.password })
  }

  const passwordsMatch = form.confirm && form.password === form.confirm

  return (
    <div className="auth-page" style={{ overflowY: 'auto' }}>
      {/* Back btn */}
      <motion.div
        style={{ paddingTop: 16, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <button onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--neutral-600)', fontFamily: 'var(--font)',
            fontSize: 14, fontWeight: 700, padding: '8px 0'
          }}>
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
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--neutral-400)', display: 'flex'
                }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>

          <div className="input-group">
            <label className="input-label">Konfirmasi Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <Lock size={16} className="input-icon" />
              <input id="reg-confirm" className="input-field" type="password" name="confirm"
                placeholder="Ulangi password" value={form.confirm}
                onChange={handleChange} required autoComplete="new-password"
                style={{ paddingRight: 40 }} />
              {form.confirm && (
                <span style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: passwordsMatch ? 'var(--success)' : 'var(--danger)',
                  display: 'flex'
                }}>
                  {passwordsMatch ? <Check size={16} /> : <X size={16} />}
                </span>
              )}
            </div>
          </div>

          <motion.button id="reg-submit" type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={registerMutation.isPending} style={{ marginTop: 6, gap: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            {registerMutation.isPending ? (
              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                Mendaftar...
              </motion.span>
            ) : (
              <><span>Daftar Sekarang</span><ArrowRight size={18} /></>
            )}
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
