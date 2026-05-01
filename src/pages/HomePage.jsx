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



export default function HomePage() {
  const { user } = useUser()

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Spacer diperkecil agar header overlap/menimpa banner sedikit */}
        <div style={{ height: 51 }} />
        <motion.div variants={stagger} initial="hidden" animate="show">
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
