import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Coffee, Ticket, User } from 'lucide-react'
import './BottomNav.css'

const navItems = [
  { path: '/',        icon: Home,   label: 'Beranda' },
  { path: '/menu',    icon: Coffee, label: 'Menu' },
  { path: '/voucher', icon: Ticket, label: 'Voucher' },
  { path: '/profil',  icon: User,   label: 'Profil' }
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bottom-nav-container">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        return (
          <motion.button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.88 }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="nav-pill"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <motion.div
              className="nav-icon-wrapper"
              animate={isActive ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} className="nav-icon" />
            </motion.div>
            <motion.span
              className="nav-label"
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.span>
          </motion.button>
        )
      })}
    </nav>
  )
}
