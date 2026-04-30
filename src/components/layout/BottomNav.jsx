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
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {isActive && (
              <motion.div
                layoutId="nav-ball"
                className="nav-ball"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <div className="nav-icon-wrapper">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="nav-icon" />
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
