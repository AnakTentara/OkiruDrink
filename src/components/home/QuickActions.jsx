import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, UtensilsCrossed, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './QuickActions.css'

const actions = [
  { icon: ShoppingBag, label: 'Order',        color: '#9BC438', bg: '#EFF8D6', path: '/menu' },
  { icon: Truck,       label: 'Promo Sehat',  color: '#F5A623', bg: '#FEF3CD', path: '/voucher' },
  { icon: UtensilsCrossed, label: 'Catering', color: '#6C8EBF', bg: '#E8F0FB', path: '/menu' },
  { icon: Gift,        label: 'Event',        color: '#E05252', bg: '#FFE5E5', path: '/voucher' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } }
}

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="quick-actions px-16">
      <motion.div className="actions-grid" variants={container} initial="hidden" animate="show">
        {actions.map(({ icon: Icon, label, color, bg, path }) => (
          <motion.button
            key={label}
            className="action-btn"
            variants={item}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(path)}
          >
            <div className="action-icon" style={{ background: bg }}>
              <Icon size={22} color={color} strokeWidth={2} />
            </div>
            <span className="action-label">{label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
