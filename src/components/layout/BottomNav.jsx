import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="nav-active-pill"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </AnimatePresence>
            <div className="nav-icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
