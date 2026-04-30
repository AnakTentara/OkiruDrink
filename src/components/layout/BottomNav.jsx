import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, Tag, User } from 'lucide-react'
import './BottomNav.css'

const navItems = [
  { icon: Home,          label: 'Beranda',  path: '/' },
  { icon: UtensilsCrossed, label: 'Menu',   path: '/menu' },
  { icon: Tag,           label: 'Voucher',  path: '/voucher' },
  { icon: User,          label: 'Profil',   path: '/profil' },
]

export default function BottomNav() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {navItems.map(({ icon: Icon, label, path }) => {
        const active = pathname === path
        return (
          <button key={path} className={`nav-item ${active ? 'active' : ''}`} onClick={() => navigate(path)}>
            <div className="nav-icon-wrap">
              {active && (
                <motion.div
                  layoutId="nav-bubble"
                  className="nav-bubble"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span className="nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
