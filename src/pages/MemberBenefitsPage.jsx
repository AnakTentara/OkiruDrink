import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronRight, Crown, Star, Award, Gem } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser, getLevelInfo } from '../context/UserContext'
import './MemberBenefitsPage.css'

const LEVELS = [
  {
    key: 'Basic',
    label: 'Okiru Member',
    icon: '🌱',
    color: '#8B8B8B',
    gradient: 'linear-gradient(135deg, #9E9E9E, #757575)',
    minPoints: 0,
    perks: [
      'Akses menu standar',
      'Poin setiap pembelian (1pt / Rp 1.000)',
      'Voucher selamat datang',
    ],
  },
  {
    key: 'Silver',
    label: 'Silver Member',
    icon: '🥈',
    color: '#A8A8A8',
    gradient: 'linear-gradient(135deg, #B0BEC5, #78909C)',
    minPoints: 500,
    perks: [
      'Semua keuntungan Basic',
      'Diskon 5% setiap pembelian',
      'Voucher ulang tahun eksklusif',
      'Akses early menu baru',
      'Prioritas antrian outlet',
    ],
  },
  {
    key: 'Gold',
    label: 'Gold Member',
    icon: '🥇',
    color: '#D4A017',
    gradient: 'linear-gradient(135deg, #F9A825, #F57F17)',
    minPoints: 2000,
    perks: [
      'Semua keuntungan Silver',
      'Diskon 10% setiap pembelian',
      'Gratis ongkir delivery',
      '1 minuman gratis / bulan',
      'Undangan event eksklusif',
      'Custom cup dengan nama',
    ],
  },
  {
    key: 'Diamond',
    label: 'Diamond Member',
    icon: '💎',
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #26C6DA, #00838F)',
    minPoints: 5000,
    perks: [
      'Semua keuntungan Gold',
      'Diskon 15% setiap pembelian',
      '2 minuman gratis / bulan',
      'Akses menu rahasia / seasonal',
      'Gift box bulanan OkiruDrink',
      'Prioritas customer support',
      'Merchandise eksklusif tahunan',
    ],
  },
]

export default function MemberBenefitsPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const currentLevel = user?.level || 'Basic'
  const currentPoints = user?.points || 0

  return (
    <div className="sub-page">
      <div className="sub-header">
        <motion.button className="sub-back" onClick={() => navigate(-1)} whileTap={{ scale: 0.9 }}>
          <ArrowLeft size={20} />
        </motion.button>
        <h2>Keuntungan Member</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-body">
        {/* Current Level Banner */}
        <motion.div
          className="mb-current-banner"
          style={{ background: LEVELS.find(l => l.key === currentLevel)?.gradient }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-banner-deco" />
          <div className="mb-banner-content">
            <span className="mb-banner-icon">
              {LEVELS.find(l => l.key === currentLevel)?.icon}
            </span>
            <div>
              <p className="mb-banner-level">{LEVELS.find(l => l.key === currentLevel)?.label}</p>
              <p className="mb-banner-points">{currentPoints.toLocaleString('id-ID')} poin</p>
            </div>
          </div>
          {/* Progress to next level */}
          {currentLevel !== 'Diamond' && (() => {
            const currentIdx = LEVELS.findIndex(l => l.key === currentLevel)
            const nextLevel = LEVELS[currentIdx + 1]
            const progress = Math.min(currentPoints / nextLevel.minPoints, 1)
            return (
              <div className="mb-banner-progress">
                <p className="mb-progress-label">
                  {nextLevel.minPoints - currentPoints > 0
                    ? `${(nextLevel.minPoints - currentPoints).toLocaleString('id-ID')} poin lagi menuju ${nextLevel.label}`
                    : `Kamu sudah layak naik ke ${nextLevel.label}!`}
                </p>
                <div className="mb-progress-bar">
                  <motion.div
                    className="mb-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            )
          })()}
        </motion.div>

        {/* Info banner */}
        <div className="mb-info-box">
          <span>ℹ️</span>
          <p>Level dievaluasi setiap <strong>31 Desember</strong>. Jika poin tidak memenuhi syarat, level akan turun 1 tingkat.</p>
        </div>

        {/* Level Cards */}
        <div className="mb-levels-list">
          {LEVELS.map((level, i) => {
            const isCurrent = level.key === currentLevel
            const isUnlocked = currentPoints >= level.minPoints
            return (
              <motion.div
                key={level.key}
                className={`mb-level-card ${isCurrent ? 'mb-lc-current' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-lc-header" style={{ background: level.gradient }}>
                  <span className="mb-lc-icon">{level.icon}</span>
                  <div className="mb-lc-title-group">
                    <h3>{level.label}</h3>
                    <span className="mb-lc-min">{level.minPoints > 0 ? `${level.minPoints.toLocaleString('id-ID')} poin` : 'Otomatis'}</span>
                  </div>
                  {isCurrent && (
                    <motion.span
                      className="mb-lc-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      Level Saat Ini
                    </motion.span>
                  )}
                </div>

                <div className="mb-lc-perks">
                  {level.perks.map((perk, j) => (
                    <div key={j} className="mb-perk">
                      <Check size={14} color={isUnlocked ? level.color : 'var(--neutral-300)'} />
                      <span style={{ color: isUnlocked ? 'var(--neutral-700)' : 'var(--neutral-400)' }}>{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
