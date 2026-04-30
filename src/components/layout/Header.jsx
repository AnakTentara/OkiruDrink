import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronDown, QrCode } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import './Header.css'

export default function Header() {
  const { user } = useUser()
  const navigate  = useNavigate()
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
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
        <div className="header-points">
          <span className="points-icon">🌟</span>
          <span className="points-val">{user?.points ?? 0} pts</span>
        </div>
        <button className="header-qr" aria-label="Scan QR">
          <QrCode size={20} color={`var(--primary-dark)`} />
        </button>
      </div>
    </header>
  )
}
