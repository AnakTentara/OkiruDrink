import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Fingerprint, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './SubPages.css'

export default function SecurityPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.newPw !== form.confirm) { setMessage('Password baru tidak cocok'); return }
    if (form.newPw.length < 6) { setMessage('Password minimal 6 karakter'); return }
    setMessage('✅ Password berhasil diubah!')
    setForm({ current: '', newPw: '', confirm: '' })
    setTimeout(() => { setMessage(''); setShowChangePassword(false) }, 2000)
  }

  const securityItems = [
    { icon: Lock, title: 'Ubah Password', sub: 'Terakhir diubah: baru saja', action: () => setShowChangePassword(!showChangePassword) },
    { icon: Fingerprint, title: 'Autentikasi Biometrik', sub: 'Belum diaktifkan', action: () => {} },
    { icon: Shield, title: 'Verifikasi 2 Langkah', sub: 'Belum diaktifkan', action: () => {} },
  ]

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Keamanan Akun</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Account info */}
        <motion.div
          style={{
            background: 'var(--primary-xlight)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            marginBottom: 16,
            border: '1px solid rgba(155,196,56,0.2)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-500)', marginBottom: 4 }}>Akun terdaftar</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--neutral-900)' }}>{user?.email || 'user@email.com'}</p>
          <p style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2 }}>
            Bergabung sejak {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Mei 2026'}
          </p>
        </motion.div>

        {/* Security Items */}
        {securityItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              className="security-item"
              onClick={item.action}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <div className="si-left">
                <div className="si-icon"><Icon size={18} color="var(--primary-dark)" /></div>
                <div>
                  <p className="si-title">{item.title}</p>
                  <p className="si-sub">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </motion.div>
          )
        })}

        {/* Change Password Form */}
        {showChangePassword && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginTop: 16 }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Ubah Password</h3>

            {message && (
              <motion.div
                className={message.includes('✅') ? 'promo-success' : 'promo-error'}
                style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: message.includes('✅') ? 'var(--primary-xlight)' : '#FFE5E5' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >{message}</motion.div>
            )}

            <div className="auth-form" style={{ gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Password Saat Ini</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input className="input-field" type={showPw ? 'text' : 'password'} name="current"
                    value={form.current} onChange={handleChange} required placeholder="Masukkan password lama" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Password Baru</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input className="input-field" type={showPw ? 'text' : 'password'} name="newPw"
                    value={form.newPw} onChange={handleChange} required placeholder="Min. 6 karakter" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Konfirmasi Password Baru</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input className="input-field" type="password" name="confirm"
                    value={form.confirm} onChange={handleChange} required placeholder="Ulangi password baru" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4 }}>Simpan Password</button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  )
}
