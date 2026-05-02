import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, User, Mail, Phone, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import './SubPages.css'

export default function EditProfilePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    // Prototype: just show success feedback
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Edit Profil</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Avatar */}
        <motion.div
          className="edit-avatar-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="edit-avatar">
            {(user?.name?.[0] || 'O').toUpperCase()}
            <div className="edit-avatar-badge">
              <Camera size={12} color="#fff" />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--neutral-400)', fontWeight: 600 }}>Ketuk untuk ubah foto</p>
        </motion.div>

        {/* Form */}
        <motion.form
          className="edit-form"
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="input-group">
            <label className="input-label">Nama Lengkap</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input className="input-field" type="text" name="name"
                value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input className="input-field" type="email" name="email"
                value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">No. WhatsApp</label>
            <div className="input-wrapper">
              <Phone size={16} className="input-icon" />
              <input className="input-field" type="tel" name="phone"
                value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          {/* Read-only info */}
          <div style={{
            background: 'var(--neutral-100)',
            borderRadius: 'var(--radius-sm)',
            padding: 14,
            marginTop: 4,
          }}>
            <p style={{ fontSize: 12, color: 'var(--neutral-500)', marginBottom: 4 }}>Level Keanggotaan</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-dark)' }}>{user?.level || 'Okiru Member'}</p>
            <p style={{ fontSize: 11, color: 'var(--neutral-400)', marginTop: 4 }}>
              Bergabung: {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
            </p>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            whileTap={{ scale: 0.97 }}
            style={{ marginTop: 12, gap: 8 }}
          >
            {saved ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                ✅ Tersimpan!
              </motion.span>
            ) : (
              <><Save size={16} /> Simpan Perubahan</>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
