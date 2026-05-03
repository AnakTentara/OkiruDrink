import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Fingerprint, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import toast from 'react-hot-toast'
import './SubPages.css'

export default function SecurityPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const [showDeleteOTP, setShowDeleteOTP] = useState(false)
  const [deleteOTP, setDeleteOTP] = useState('')
  const [loadingDelete, setLoadingDelete] = useState(false)

  const handleRequestDelete = async () => {
    if (!window.confirm('PERINGATAN! Penghapusan akun tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?')) return
    setLoadingDelete(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/delete-otp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('okiru_token')}` }
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      setShowDeleteOTP(true)
      toast.success('Kode OTP penghapusan telah dikirim.')
    } catch (err) {
      toast.error(err.message || 'Gagal meminta OTP')
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleDeleteConfirm = async (e) => {
    e.preventDefault()
    setLoadingDelete(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('okiru_token')}` 
        },
        body: JSON.stringify({ code: deleteOTP })
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      
      toast.success('Akun Anda berhasil dihapus.')
      useUser.getState().logout()
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus akun')
      setDeleteOTP('')
    } finally {
      setLoadingDelete(false)
    }
  }

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

        {/* Delete Account Section */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--neutral-200)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>Area Berbahaya</h3>
          <p style={{ fontSize: 13, color: 'var(--neutral-500)', marginBottom: 16 }}>
            Penghapusan akun bersifat permanen. Semua data personal, voucher, dan poin akan dianonimkan atau dihapus.
          </p>
          
          {!showDeleteOTP ? (
            <button 
              className="btn btn-full" 
              style={{ background: '#FFE5E5', color: 'var(--danger)' }}
              onClick={handleRequestDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? 'Memproses...' : 'Hapus Akun Saya'}
            </button>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleDeleteConfirm}
              className="auth-form"
            >
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--danger)' }}>Masukkan OTP Hapus Akun</label>
                <p style={{ fontSize: 11, color: 'var(--neutral-400)', marginBottom: 8 }}>
                  Kode OTP telah dikirim ke nomor/email Anda. (Bisa gunakan 123456)
                </p>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" color="var(--danger)" />
                  <input 
                    className="input-field" 
                    type="text" 
                    value={deleteOTP} 
                    onChange={e => setDeleteOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Kode 6 digit" 
                    required 
                    maxLength={6}
                    style={{ borderColor: 'var(--danger)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteOTP(false)}>Batal</button>
                <button type="submit" className="btn" style={{ flex: 1, background: 'var(--danger)', color: '#fff' }} disabled={loadingDelete || deleteOTP.length < 4}>
                  {loadingDelete ? 'Menghapus...' : 'Konfirmasi'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
