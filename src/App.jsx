import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { UserProvider, useUser } from './context/UserContext'
import { CartProvider }          from './context/CartContext'

import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import OTPPage          from './pages/OTPPage'
import HomePage         from './pages/HomePage'
import MenuPage         from './pages/MenuPage'
import VoucherPage      from './pages/VoucherPage'
import ProfilePage      from './pages/ProfilePage'
import CartPage         from './pages/CartPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

// ── Protected Route — redirect to /login if not authenticated ──
function Protected({ children }) {
  const { user, loading } = useUser()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          border: '3px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          animation: 'spin-slow 0.8s linear infinite',
        }} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// ── Auth Route — redirect to / if already logged in ──
function AuthRoute({ children }) {
  const { user, loading } = useUser()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return children
}

// ── Animated routes wrapper ──
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth */}
        <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/otp"      element={<OTPPage />} />

        {/* Protected */}
        <Route path="/"              element={<Protected><HomePage /></Protected>} />
        <Route path="/menu"          element={<Protected><MenuPage /></Protected>} />
        <Route path="/voucher"       element={<Protected><VoucherPage /></Protected>} />
        <Route path="/profil"        element={<Protected><ProfilePage /></Protected>} />
        <Route path="/cart"          element={<Protected><CartPage /></Protected>} />
        <Route path="/order-success" element={<Protected><OrderSuccessPage /></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          {/* ── Desktop Wrapper: branded background + phone frame ── */}
          <div className="desktop-wrapper">
            {/* Left branding panel — only visible on desktop */}
            <div className="desktop-branding">
              <div className="db-content">
                {/* Logo + Brand */}
                <div className="db-logo-group">
                  <img src="/logo.jpg" alt="OkiruDrink" className="db-logo-img" />
                  <div>
                    <h1 className="db-brand-name">OkiruDrink</h1>
                    <p className="db-tagline">Healthy but Tasty 🌿</p>
                  </div>
                </div>

                {/* Headline */}
                <div className="db-description">
                  <div className="db-divider" />
                  <h2 className="db-headline">
                    Rasakan<br />
                    <span>Kesegaran Nyata.</span>
                  </h2>
                  <p className="db-sub">
                    Dibuat dari ekstrak <strong>Daun Plectranthus amboinicus</strong> (Torbangun) pilihan 
                    dan manis alami <strong>Stevia</strong>. Nikmati pengalaman terbaik OkiruDrink 
                    dengan membuka website ini langsung di perangkat handphone-mu! 📱✨
                  </p>
                </div>

                {/* Feature cards */}
                <div className="db-features">
                  <div className="db-feature">
                    <span className="db-feature-icon">🍃</span>
                    <div>
                      <p className="db-feature-title">100% Bahan Alami</p>
                      <p className="db-feature-sub">Plectranthus amboinicus & Stevia</p>
                    </div>
                  </div>
                  <div className="db-feature">
                    <span className="db-feature-icon">🫀</span>
                    <div>
                      <p className="db-feature-title">Kaya Manfaat</p>
                      <p className="db-feature-sub">Baik untuk pencernaan & daya tahan tubuh</p>
                    </div>
                  </div>
                  <div className="db-feature">
                    <span className="db-feature-icon">⚡</span>
                    <div>
                      <p className="db-feature-title">Mobile First Experience</p>
                      <p className="db-feature-sub">Buka di HP untuk pengalaman optimal</p>
                    </div>
                  </div>
                </div>

                {/* CTA badges */}
                <div className="db-cta-row">
                  <span className="db-cta-badge">🌿 Halal & Aman</span>
                  <span className="db-cta-badge">✓ BPOM Terdaftar</span>
                  <span className="db-cta-badge">📦 200ml / Botol</span>
                </div>

                <p className="db-footer">© 2026 OkiruDrink — Muara Enim, Sumatera Selatan</p>
              </div>
            </div>

            {/* Phone Frame — contains the actual app */}
            <div className="phone-frame-wrapper">
              <div className="phone-frame">
                {/* Phone notch */}
                <div className="phone-notch">
                  <div className="phone-notch-inner">
                    <div className="phone-camera" />
                    <div className="phone-speaker" />
                  </div>
                </div>

                {/* App content */}
                <div className="app-shell">
                  <AnimatedRoutes />
                </div>

                {/* Phone home indicator */}
                <div className="phone-home-indicator">
                  <div className="phone-home-bar" />
                </div>
              </div>
            </div>
          </div>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}
