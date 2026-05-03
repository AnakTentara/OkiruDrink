import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Award, Gift, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser, ALL_LEVELS } from '../store/useUserStore'
import './SubPages.css'

const benefits = [
  { icon: '🎁', title: 'Gratis 1 Cup', desc: 'Tukarkan poinmu dengan minuman gratis!', bg: '#EFF8D6' },
  { icon: '💰', title: 'Cashback Poin', desc: 'Setiap Rp 1.000 pembelian = 1 poin OkiruDrink', bg: '#FEF3CD' },
  { icon: '🏆', title: 'Sistem Tiering', desc: 'Semakin tinggi levelmu, semakin besar diskon otomatisnya!', bg: '#E8F0FB' },
  { icon: '🎉', title: 'Akses Eksklusif', desc: 'Dapatkan kesempatan mencoba menu baru sebelum dirilis publik.', bg: '#FFE5E5' },
  { icon: '🌟', title: 'Kejutan Ulang Tahun', desc: 'Voucher spesial di bulan ulang tahunmu khusus member aktif.', bg: '#F3E8FB' },
]

export default function LoyaltyPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const points = user?.points ?? 0

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Program Loyalitas</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Hero Card */}
        <motion.div
          className="loyalty-hero"
          style={{ background: ALL_LEVELS.find(l => l.key === (user?.level || 'Basic'))?.gradient || 'linear-gradient(135deg, #6A9A1F, #9BC438)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="lh-title">Poin OkiruDrink</p>
          <p className="lh-points">{points.toLocaleString('id-ID')}</p>
          <p className="lh-label">Total Poin Terkumpul</p>
          <span className="lh-level">{ALL_LEVELS.find(l => l.key === (user?.level || 'Basic'))?.label || 'Okiru Member'}</span>
        </motion.div>

        {/* Level Tiers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Level Keanggotaan</h3>
          <button onClick={() => navigate('/member-benefits')} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>Lihat Detail</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {ALL_LEVELS.map((lv, i) => (
            <motion.div
              key={lv.key}
              style={{
                background: points >= lv.minPoints ? lv.gradient : 'var(--neutral-100)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 8px',
                textAlign: 'center',
                color: points >= lv.minPoints ? '#fff' : 'var(--neutral-500)',
                transition: 'all 0.3s ease',
                border: points >= lv.minPoints ? 'none' : '1px dashed var(--neutral-300)',
                boxShadow: points >= lv.minPoints ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <span style={{ fontSize: 24 }}>{lv.icon}</span>
              <p style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>{lv.label}</p>
              <p style={{ fontSize: 10, opacity: points >= lv.minPoints ? 0.9 : 0.7, marginTop: 2 }}>{lv.minPoints.toLocaleString('id-ID')} pts</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Keuntungan Member</h3>
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            className="benefit-card"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <div className="bc-icon" style={{ background: b.bg }}>{b.icon}</div>
            <div className="bc-info">
              <p className="bc-title">{b.title}</p>
              <p className="bc-desc">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
