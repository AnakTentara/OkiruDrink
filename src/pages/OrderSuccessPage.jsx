import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'
import './OrderSuccessPage.css'

// Random confetti pieces
const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  color: ['#9BC438','#F5A623','#6A9A1F','#D4EDAA','#FEF3CD'][i % 5],
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 0.8,
  size: 6 + Math.random() * 8,
}))

export default function OrderSuccessPage() {
  const navigate        = useNavigate()
  const location        = useLocation()
  const { addOrder, addPoints } = useUser()
  const { cart, clearCart }     = useCart()

  const orderData = location.state?.order || {
    items: cart.items,
    total: cart.totalPrice,
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

  return (
    <div className="success-page">
      {/* Confetti */}
      <div className="confetti-wrap" aria-hidden>
        {CONFETTI.map(c => (
          <motion.div
            key={c.id}
            className="confetti-piece"
            style={{ left: c.left, background: c.color, width: c.size, height: c.size, borderRadius: c.size / 2 }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: 0, rotate: 720 }}
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
            <span className="os-val">#OKR{Date.now().toString().slice(-6)}</span>
          </div>
          <div className="os-row">
            <span className="os-label">Total Bayar</span>
            <span className="os-val os-price">{formatRp(orderData.total)}</span>
          </div>
          <div className="os-row">
            <span className="os-label">Estimasi Selesai</span>
            <span className="os-val">± 15-20 menit</span>
          </div>
          <div className="os-row">
            <span className="os-label">Poin Didapat</span>
            <span className="os-val" style={{ color: 'var(--accent)' }}>
              +{Math.floor((orderData.total || 0) / 1000) * 5} pts 🌟
            </span>
          </div>
        </motion.div>

        <motion.div
          className="success-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            id="back-home"
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate('/')}
          >
            <Home size={18} /> Kembali ke Beranda
          </button>
          <button
            id="order-more"
            className="btn btn-outline btn-full"
            onClick={() => navigate('/menu')}
          >
            <ShoppingBag size={16} /> Pesan Lagi
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
