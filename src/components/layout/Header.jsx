import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapPin, ChevronDown, QrCode } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import './Header.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 11) return { text: 'Selamat Pagi',  emoji: '☀️' }
  if (h < 15) return { text: 'Selamat Siang', emoji: '🌤️' }
  if (h < 18) return { text: 'Selamat Sore',  emoji: '🌅' }
  return        { text: 'Selamat Malam', emoji: '🌙' }
}

const HOME_H      = 144  // tinggi penuh di home (dengan greeting)
const BASE_H      = 64   // tinggi compact
const SCROLL_RANGE = 80  // px scroll untuk menciut penuh

export default function Header() {
  const { user }   = useUser()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const headerRef  = useRef(null)
  const isHome     = location.pathname === '/'

  useEffect(() => {
    const pageEl   = document.querySelector('.page-content')
    const headerEl = headerRef.current
    if (!pageEl || !headerEl) return

    const update = () => {
      const st    = pageEl.scrollTop
      const ratio = Math.min(Math.max(st / SCROLL_RANGE, 0), 1)

      // Binary state — hanya untuk logo size & accent line via CSS class
      setScrolled(st > 10)

      if (isHome) {
        // ── Scroll-linked: langsung, proporsional, tanpa delay ──

        // Height: 144px → 64px seiring scroll
        const h = HOME_H - ratio * (HOME_H - BASE_H)
        headerEl.style.height = h + 'px'

        // Border-radius: hanya bawah yang rounded (atas flat)
        const br = Math.round(24 * (1 - ratio))
        headerEl.style.borderRadius = `0 0 ${br}px ${br}px`

        // Box shadow muncul seiring scroll
        if (ratio > 0.02) {
          headerEl.style.boxShadow =
            `0 2px ${ratio * 20}px rgba(0,0,0,${ratio * 0.07}),` +
            `0 1px 0 rgba(155,196,56,${ratio * 0.12})`
          headerEl.style.borderBottomColor =
            `rgba(155, 196, 56, ${ratio * 0.18})`
        } else {
          headerEl.style.boxShadow       = 'none'
          headerEl.style.borderBottomColor = 'transparent'
        }
      }
    }

    pageEl.addEventListener('scroll', update, { passive: true })
    update() // initial
    return () => pageEl.removeEventListener('scroll', update)
  }, [isHome])

  const greeting = getGreeting()

  return (
    <header
      ref={headerRef}
      className={`app-header ${scrolled ? 'scrolled' : ''} ${isHome ? 'is-home' : ''}`}
    >
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
