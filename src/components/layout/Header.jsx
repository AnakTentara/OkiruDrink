import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapPin, ChevronDown, QrCode } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import './Header.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 11) return { text: 'Selamat Pagi', emoji: '☀️' }
  if (h < 15) return { text: 'Selamat Siang', emoji: '🌤️' }
  if (h < 18) return { text: 'Selamat Sore', emoji: '🌅' }
  return { text: 'Selamat Malam', emoji: '🌙' }
}

export default function Header() {
  const { user } = useUser()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const pageContent = document.querySelector('.page-content')
    if (!pageContent) return

    const handleScroll = () => {
      setScrolled(pageContent.scrollTop > 20)
    }

    pageContent.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check

    return () => pageContent.removeEventListener('scroll', handleScroll)
  }, [])

  const greeting = getGreeting()

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''} ${isHome ? 'is-home' : ''}`}>
      <div className="header-top-row">
        {/* Left: Logo + level */}
        <button className="header-brand" onClick={() => navigate('/')}>
          <img src="/logo.jpg" alt="OkiruDrink" className="header-logo-img" />
          <div className="header-brand-text">
            <span className="header-brand-name">OkiruDrink</span>
            <span className="header-level">
              <span className="level-dot" />
              {user?.level || 'Okiru Member'}
            </span>
          </div>
        </button>

        {/* Center: Location */}
        <button className="header-location">
          <MapPin size={13} className="location-pin" />
          <span className="location-text">Muara Enim</span>
          <ChevronDown size={13} />
        </button>

        {/* Right: Points + QR */}
        <div className="header-right">
          {(!isHome || scrolled) && (
            <div className="header-points">
              <span className="points-icon">🌟</span>
              <span className="points-val">{user?.points ?? 0} pts</span>
            </div>
          )}
          <button className="header-qr" aria-label="Scan QR">
            <QrCode size={20} color={`var(--primary-dark)`} />
          </button>
        </div>
      </div>

      {isHome && (
        <div className="header-greeting-row">
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
        </div>
      )}
    </header>
  )
}
