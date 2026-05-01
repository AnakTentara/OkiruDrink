import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Package, MapPin, Star, ChevronRight, Leaf, Shield, Award, Edit3, QrCode, Gift, Navigation, Info, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useUser, getLevelInfo } from '../context/UserContext'
import './ProfilePage.css'

const menuItems = [
  { icon: Package,    label: 'Riwayat Pesanan',     path: '/orders' },
  { icon: MapPin,     label: 'Alamat Pengiriman',   path: '/address' },
  { icon: Star,       label: 'Program Loyalitas',   path: '/loyalty' },
  { icon: Crown,      label: 'Keuntungan Member',   path: '/member-benefits' },
  { icon: Gift,       label: 'Tukar Poin',          path: '/redeem' },
  { icon: QrCode,     label: 'Kode QR Member',      path: '/qr-code' },
  { icon: Navigation, label: 'Ganti Lokasi Outlet', path: '/location' },
  { icon: Shield,     label: 'Keamanan Akun',       path: '/security' },
  { icon: Info,       label: 'Tentang OkiruDrink',  path: '/about' },
]

function AnimatedCounter({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const end = typeof value === 'number' ? value : parseInt(value) || 0
    if (end === 0) { setDisplay(0); return }
    const duration = 600
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])
  return <>{display}{suffix}</>
}

export default function ProfilePage() {
  const { user } = useUser()
  const navigate = useNavigate()

  const orders = user?.orders || []
  const points = user?.points ?? 0
  const levelInfo = getLevelInfo(user?.level || 'Basic')
  const levelProgress = levelInfo.nextMin ? Math.min(points / levelInfo.nextMin, 1) : 1

  return (
    <>
      <main className="page-content" style={{ paddingTop: 0 }}>
        {/* Profile Card */}
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="profile-avatar"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => navigate('/edit-profile')}
            style={{ cursor: 'pointer' }}
          >
            {(user?.name?.[0] || 'O').toUpperCase()}
          </motion.div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name || 'Pengguna'}</h2>
            <p className="profile-email">{user?.email || ''}</p>
            <div className="profile-level" onClick={() => navigate('/member-benefits')} style={{ cursor: 'pointer' }}>
              <span>{levelInfo.icon}</span>
              {levelInfo.label}
            </div>
          </div>
          <motion.button
            onClick={() => navigate('/edit-profile')}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(255,255,255,0.2)', border: 'none',
              borderRadius: 10, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <Edit3 size={16} />
          </motion.button>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          className="level-progress-card px-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="lp-header">
            <div className="lp-left">
              <Award size={16} color="var(--primary-dark)" />
              <span className="lp-title">Progress Level</span>
            </div>
            <span className="lp-target">{points}/500 pts</span>
          </div>
          <div className="lp-bar-track">
            <motion.div
              className="lp-bar-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: levelProgress }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <p className="lp-hint">
            {points >= 500
              ? '🎉 Selamat! Kamu sudah Okiru VIP!'
              : `${500 - points} pts lagi untuk naik ke Okiru VIP ✨`
            }
          </p>
        </motion.div>

        {/* Stats */}
        <div className="profile-stats px-16">
          {[
            { label: 'Total Poin',   value: points,        suffix: ' pts', icon: '🌟' },
            { label: 'Stamp',        value: `${user?.stamps ?? 0}/3`, icon: '☕' },
            { label: 'Pesanan',      value: orders.length,            icon: '📦' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-box"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">
                {typeof s.value === 'number'
                  ? <AnimatedCounter value={s.value} suffix={s.suffix || ''} />
                  : s.value
                }
              </span>
              <span className="stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <motion.div
            style={{ padding: '0 16px', marginBottom: 12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Pesanan Terakhir</h3>
              <button
                onClick={() => navigate('/orders')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}
              >Lihat Semua</button>
            </div>
            {orders.slice(0, 2).map((o, i) => (
              <motion.div
                key={i}
                className="order-row"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{o.items?.length ?? 0} item</p>
                  <p style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                    {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>
                  Rp {o.total?.toLocaleString('id-ID')}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Menu Items */}
        <div className="profile-menu px-16">
          {menuItems.map(({ icon: Icon, label, path }, i) => (
            <motion.button
              key={path}
              className="profile-menu-item"
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
            >
              <div className="pmi-left">
                <div className="pmi-icon">
                  <Icon size={18} color="var(--primary-dark)" />
                </div>
                <span className="pmi-label">{label}</span>
              </div>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <div className="px-16" style={{ marginTop: 8 }}>
          <motion.button
            className="btn btn-outline btn-full"
            onClick={() => navigate('/logout')}
            whileTap={{ scale: 0.97 }}
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)', gap: 8 }}
          >
            <LogOut size={16} /> Keluar dari Akun
          </motion.button>
        </div>

        <div style={{ height: 24 }} />
      </main>
      <BottomNav />
    </>
  )
}
