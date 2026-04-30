import React from 'react'
import { motion } from 'framer-motion'
import Header        from '../components/layout/Header'
import BottomNav     from '../components/layout/BottomNav'
import HeroCarousel  from '../components/home/HeroCarousel'
import QuickActions  from '../components/home/QuickActions'
import VoucherBanner from '../components/home/VoucherBanner'
import LoyaltyCard   from '../components/home/LoyaltyCard'
import TodaySpecial  from '../components/home/TodaySpecial'
import CartButton    from '../components/shared/CartButton'
import { useUser }   from '../context/UserContext'
import './HomePage.css'

const section = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } }
}

// Get time-based greeting
function getGreeting() {
  const h = new Date().getHours()
  if (h < 11) return { text: 'Selamat Pagi', emoji: '☀️' }
  if (h < 15) return { text: 'Selamat Siang', emoji: '🌤️' }
  if (h < 18) return { text: 'Selamat Sore', emoji: '🌅' }
  return { text: 'Selamat Malam', emoji: '🌙' }
}

export default function HomePage() {
  const { user } = useUser()
  const greeting = getGreeting()

  return (
    <>
      <Header />
      <main className="page-content">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* ── Greeting Banner ── */}
          <motion.div variants={section} className="home-greeting">
            <div className="greeting-text-wrap">
              <p className="greeting-sub">{greeting.text} {greeting.emoji}</p>
              <h1 className="greeting-name">
                {user?.name?.split(' ')[0] || 'Sahabat'} <span className="greeting-wave">👋</span>
              </h1>
              <p className="greeting-tagline">Mau minum apa hari ini?</p>
            </div>
            <div className="greeting-badge">
              <span className="greeting-pts-icon">🌟</span>
              <div>
                <p className="greeting-pts-val">{user?.points ?? 0}</p>
                <p className="greeting-pts-label">points</p>
              </div>
            </div>
          </motion.div>

          {/* ── Hero Carousel ── */}
          <motion.div variants={section} style={{ marginTop: 4 }}>
            <HeroCarousel />
          </motion.div>

          {/* ── Quick Actions ── */}
          <motion.div variants={section} style={{ marginTop: 16 }}>
            <QuickActions />
          </motion.div>

          {/* ── Voucher Banner ── */}
          <motion.div variants={section} style={{ marginTop: 12 }}>
            <VoucherBanner />
          </motion.div>

          {/* ── Loyalty Card ── */}
          <motion.div variants={section} style={{ marginTop: 12 }}>
            <LoyaltyCard />
          </motion.div>

          {/* ── Section Divider ── */}
          <motion.div variants={section}>
            <div className="home-section-divider">
              <div className="hsd-line" />
              <span className="hsd-label">🌿 Spesial Hari Ini</span>
              <div className="hsd-line" />
            </div>
          </motion.div>

          {/* ── Today Special ── */}
          <motion.div variants={section}>
            <TodaySpecial />
          </motion.div>

          <div style={{ height: 24 }} />
        </motion.div>
      </main>

      <CartButton />
      <BottomNav />
    </>
  )
}
