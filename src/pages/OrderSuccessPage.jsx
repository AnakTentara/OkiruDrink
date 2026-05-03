import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home, ShoppingBag, Package, Coffee, Clock, Share2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import { useCartStore as useCart } from '../store/useCartStore'
import './OrderSuccessPage.css'

// Random confetti pieces
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  color: ['#9BC438','#F5A623','#6A9A1F','#D4EDAA','#FEF3CD','#E05252'][i % 6],
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 0.8,
  size: 5 + Math.random() * 8,
  shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0',
}))

const trackingSteps = [
  { icon: CheckCircle, label: 'Pesanan Diterima', sub: 'Menunggu konfirmasi', done: true },
  { icon: Coffee,      label: 'Sedang Dibuat',    sub: 'Barista membuatkan pesananmu', done: false },
  { icon: Package,     label: 'Siap Diambil',     sub: 'Pesanan siap di counter',     done: false },
]

export default function OrderSuccessPage() {
  const navigate        = useNavigate()
  const location        = useLocation()
  const { addOrder, addPoints } = useUser()
  const { items, getCartTotal, clearCart } = useCart()
  const [orderNum] = useState(() => `#OKR${Date.now().toString().slice(-6)}`)

  const orderData = location.state?.order || {
    items: items,
    total: getCartTotal(),
  }

  useEffect(() => {
    if (orderData.items?.length > 0) {
      addOrder({ items: orderData.items, total: orderData.total })
      addPoints(Math.floor(orderData.total / 1000) * 5)
      clearCart()
    }
    // eslint-disable-next-line
  }, [])

  const formatRp = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`
  const pointsEarned = Math.floor((orderData.total || 0) / 1000) * 5

  return (
    <div className="success-page">
      {/* Confetti */}
      <div className="confetti-wrap" aria-hidden>
        {CONFETTI.map(c => (
          <motion.div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              background: c.color,
              width: c.size,
              height: c.size * (c.shape === '2px' ? 3 : 1),
              borderRadius: c.shape,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: 0, rotate: 720 + Math.random() * 360 }}
            transition={{ duration: 2.5 + Math.random(), delay: c.delay, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="success-content"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.2 }}
      >
        <motion.div
          className="success-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.4 }}
        >
          <CheckCircle size={52} color="#fff" strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <h1 className="success-title">Pesanan Berhasil! 🎉</h1>
          <p className="success-sub">Pesananmu sedang diproses oleh tim OkiruDrink</p>
        </motion.div>

        {/* Order summary card */}
        <motion.div
          className="order-summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <div className="os-row">
            <span className="os-label">No. Pesanan</span>
            <span className="os-val os-order-num">{orderNum}</span>
          </div>
          <div className="os-row">
            <span className="os-label">Total Bayar</span>
            <span className="os-val os-price">{formatRp(orderData.total)}</span>
          </div>
          <div className="os-row">
            <span className="os-label">Estimasi Selesai</span>
            <span className="os-val">
              <Clock size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
              ± 15-20 menit
            </span>
          </div>
          <div className="os-row">
            <span className="os-label">Poin Didapat</span>
            <span className="os-val os-points">
              +{pointsEarned} pts 🌟
            </span>
          </div>
        </motion.div>

        {/* Order Tracking Timeline */}
        <motion.div
          className="tracking-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="tracking-title">Status Pesanan</h3>
          <div className="tracking-timeline">
            {trackingSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  className={`tracking-step ${step.done ? 'done' : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  <div className="ts-indicator">
                    <div className={`ts-dot ${step.done ? 'ts-dot-done' : ''}`}>
                      {step.done && <CheckCircle size={14} color="#fff" />}
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div className={`ts-line ${step.done ? 'ts-line-done' : ''}`} />
                    )}
                  </div>
                  <div className="ts-content">
                    <span className="ts-label">{step.label}</span>
                    <span className="ts-sub">{step.sub}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          className="success-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.button
            id="back-home"
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate('/')}
            whileTap={{ scale: 0.97 }}
          >
            <Home size={18} /> Kembali ke Beranda
          </motion.button>
          <motion.button
            id="order-more"
            className="btn btn-outline btn-full"
            onClick={() => navigate('/menu')}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={16} /> Pesan Lagi
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
