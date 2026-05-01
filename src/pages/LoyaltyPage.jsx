import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Award, Gift, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './SubPages.css'

const benefits = [
  { icon: '🎁', title: 'Gratis 1 Cup', desc: 'Kumpulkan 3 stamp dan dapatkan 1 minuman gratis!', bg: '#EFF8D6' },
  { icon: '💰', title: 'Poin Setiap Pembelian', desc: 'Setiap Rp 1.000 pembelian = 5 poin OkiruDrink', bg: '#FEF3CD' },
  { icon: '🏆', title: 'Level VIP', desc: 'Kumpulkan 500 poin untuk naik ke Okiru VIP dengan benefit eksklusif', bg: '#E8F0FB' },
  { icon: '🎉', title: 'Promo Member', desc: 'Dapatkan promo dan voucher eksklusif khusus member terdaftar', bg: '#FFE5E5' },
  { icon: '🌟', title: 'Birthday Surprise', desc: 'Kejutan spesial di hari ulang tahunmu dari OkiruDrink', bg: '#F3E8FB' },
]

const levels = [
  { name: 'Okiru Member', min: 0, icon: '🌱', color: '#9BC438' },
  { name: 'Okiru VIP', min: 500, icon: '⭐', color: '#F5A623' },
  { name: 'Okiru Elite', min: 2000, icon: '💎', color: '#6C8EBF' },
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="lh-title">Poin OkiruDrink</p>
          <p className="lh-points">{points}</p>
          <p className="lh-label">Total Poin Terkumpul</p>
          <span className="lh-level">{user?.level || 'Okiru Member'}</span>
        </motion.div>

        {/* Level Tiers */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Level Keanggotaan</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {levels.map((lv, i) => (
            <motion.div
              key={lv.name}
              style={{
                flex: 1,
                background: points >= lv.min ? lv.color : 'var(--neutral-100)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 8px',
                textAlign: 'center',
                color: points >= lv.min ? '#fff' : 'var(--neutral-500)',
                transition: 'all 0.3s ease',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <span style={{ fontSize: 24 }}>{lv.icon}</span>
              <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>{lv.name}</p>
              <p style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>{lv.min}+ pts</p>
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
