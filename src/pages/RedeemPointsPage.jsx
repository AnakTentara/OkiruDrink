import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import './SubPages.css'

const rewards = [
  { id: 'r1', name: 'Diskon 10%', desc: 'Voucher diskon 10% untuk pembelian berikutnya', cost: 50, icon: '🏷️', bg: '#EFF8D6' },
  { id: 'r2', name: 'Gratis Ongkir', desc: 'Gratis ongkos kirim untuk 1x pengiriman', cost: 80, icon: '🚚', bg: '#E8F0FB' },
  { id: 'r3', name: '1 Cup Gratis', desc: '1 cup Teh Jintan Original ukuran reguler', cost: 150, icon: '🍵', bg: '#FEF3CD' },
  { id: 'r4', name: 'Merchandise Tumbler', desc: 'Tumbler OkiruDrink edisi eksklusif (350ml)', cost: 500, icon: '🏆', bg: '#F3E8FB' },
  { id: 'r5', name: 'Paket Teh 1 Minggu', desc: '7 botol Teh Jintan campuran semua varian', cost: 800, icon: '📦', bg: '#FFE5E5' },
]

export default function RedeemPointsPage() {
  const { user, addPoints } = useUser()
  const navigate = useNavigate()
  const points = user?.points ?? 0
  const [redeemed, setRedeemed] = useState(null)

  const handleRedeem = (reward) => {
    if (points < reward.cost) return
    addPoints(-reward.cost)
    setRedeemed(reward.id)
    setTimeout(() => setRedeemed(null), 2000)
  }

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Tukar Poin</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Points Balance */}
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #6A9A1F, #9BC438)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 20,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 600 }}>Poin Tersedia</p>
          <p style={{ fontSize: 40, fontWeight: 800, margin: '4px 0' }}>{points}</p>
          <p style={{ fontSize: 12, opacity: 0.7 }}>Tukarkan poinmu dengan hadiah menarik!</p>
        </motion.div>

        {/* Rewards list */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Hadiah Tersedia</h3>
        {rewards.map((r, i) => (
          <motion.div
            key={r.id}
            className="redeem-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <div className="rc-icon" style={{ background: r.bg }}>{r.icon}</div>
            <div className="rc-info">
              <p className="rc-name">{r.name}</p>
              <p className="rc-desc">{r.desc}</p>
              <div className="rc-cost">
                <Star size={12} /> {r.cost} pts
              </div>
            </div>
            <AnimatePresence mode="wait">
              {redeemed === r.id ? (
                <motion.span
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Check size={14} /> Ditukar!
                </motion.span>
              ) : (
                <motion.button
                  key="btn"
                  className="rc-btn"
                  disabled={points < r.cost}
                  onClick={() => handleRedeem(r)}
                >
                  Tukar
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
