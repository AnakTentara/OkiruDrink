import React, { useState, useCallback, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { useUserStore } from './store/useUserStore'

import SplashScreen     from './components/shared/SplashScreen'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import OTPPage          from './pages/OTPPage'
import HomePage         from './pages/HomePage'
import MenuPage         from './pages/MenuPage'
import VoucherPage      from './pages/VoucherPage'
import ProfilePage      from './pages/ProfilePage'
import CartPage         from './pages/CartPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

// Sub-pages
import OrderHistoryPage  from './pages/OrderHistoryPage'
import AddressPage       from './pages/AddressPage'
import LoyaltyPage       from './pages/LoyaltyPage'
import SecurityPage      from './pages/SecurityPage'
import AboutPage         from './pages/AboutPage'
import LogoutPage        from './pages/LogoutPage'
import RedeemPointsPage  from './pages/RedeemPointsPage'
import EditProfilePage   from './pages/EditProfilePage'
import QRCodePage        from './pages/QRCodePage'
import LocationPage      from './pages/LocationPage'
import MemberBenefitsPage from './pages/MemberBenefitsPage'
import LiveChatPage     from './pages/LiveChatPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

// ── Page transition variants ──
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
}

function PageWrap({ children }) {
  const location = useLocation()
  const isSlideUp = location.state?.slideFromBottom
  
  const variants = isSlideUp ? {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit:    { opacity: 0, y: '100%', transition: { duration: 0.2 } }
  } : pageVariants

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}

// ── Protected Route ──
function Protected({ children }) {
  const { user, loading } = useUserStore()
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

// ── Auth Route ──
function AuthRoute({ children }) {
  const { user, loading } = useUserStore()
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
        <Route path="/login"    element={<AuthRoute><PageWrap><LoginPage /></PageWrap></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><PageWrap><RegisterPage /></PageWrap></AuthRoute>} />
        <Route path="/otp"      element={<PageWrap><OTPPage /></PageWrap>} />

        {/* Main */}
        <Route path="/"              element={<Protected><PageWrap><HomePage /></PageWrap></Protected>} />
        <Route path="/menu"          element={<Protected><PageWrap><MenuPage /></PageWrap></Protected>} />
        <Route path="/voucher"       element={<Protected><PageWrap><VoucherPage /></PageWrap></Protected>} />
        <Route path="/profil"        element={<Protected><PageWrap><ProfilePage /></PageWrap></Protected>} />
        <Route path="/cart"          element={<Protected><PageWrap><CartPage /></PageWrap></Protected>} />
        <Route path="/order-success" element={<Protected><PageWrap><OrderSuccessPage /></PageWrap></Protected>} />

        {/* Sub-pages */}
        <Route path="/orders"        element={<Protected><PageWrap><OrderHistoryPage /></PageWrap></Protected>} />
        <Route path="/address"       element={<Protected><PageWrap><AddressPage /></PageWrap></Protected>} />
        <Route path="/loyalty"       element={<Protected><PageWrap><LoyaltyPage /></PageWrap></Protected>} />
        <Route path="/security"      element={<Protected><PageWrap><SecurityPage /></PageWrap></Protected>} />
        <Route path="/about"         element={<Protected><PageWrap><AboutPage /></PageWrap></Protected>} />
        <Route path="/logout"        element={<Protected><PageWrap><LogoutPage /></PageWrap></Protected>} />
        <Route path="/redeem"        element={<Protected><PageWrap><RedeemPointsPage /></PageWrap></Protected>} />
        <Route path="/edit-profile"  element={<Protected><PageWrap><EditProfilePage /></PageWrap></Protected>} />
        <Route path="/qr-code"       element={<Protected><PageWrap><QRCodePage /></PageWrap></Protected>} />
        <Route path="/location"      element={<Protected><PageWrap><LocationPage /></PageWrap></Protected>} />
        <Route path="/member-benefits" element={<Protected><PageWrap><MemberBenefitsPage /></PageWrap></Protected>} />
        <Route path="/live-chat"      element={<Protected><PageWrap><LiveChatPage /></PageWrap></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashFinish = useCallback(() => setSplashDone(true), [])
  const { setUser, setLoading } = useUserStore()

  useEffect(() => {
    // Attempt auto-login if token exists
    const token = localStorage.getItem('okiru_token')
    if (token) {
      setLoading(true)
      fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setUser(data.user)
        else localStorage.removeItem('okiru_token')
      })
      .catch(() => localStorage.removeItem('okiru_token'))
      .finally(() => setLoading(false))
    }
  }, [setUser, setLoading])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '99px'
            }
          }} />
          {/* Splash Screen */}
          <AnimatePresence>
            {!splashDone && <SplashScreen key="splash" onFinish={handleSplashFinish} />}
          </AnimatePresence>

          {/* ── Desktop Wrapper: branded background + phone frame ── */}
          {splashDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="desktop-wrapper">
                {/* Left branding panel — only visible on desktop */}
                <div className="desktop-branding">
                  <div className="db-content">
                    <div className="db-logo-group">
                      <img src="/logo.jpg" alt="OkiruDrink" className="db-logo-img" />
                      <div>
                        <h1 className="db-brand-name">OkiruDrink</h1>
                        <p className="db-tagline">Healthy but Tasty 🌿</p>
                      </div>
                    </div>

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

                    <div className="db-cta-row">
                      <span className="db-cta-badge">🌿 Halal & Aman</span>
                      <span className="db-cta-badge">✓ BPOM Terdaftar</span>
                      <span className="db-cta-badge">📦 200ml / Botol</span>
                    </div>

                    <p className="db-footer">© 2026 OkiruDrink — Muara Enim, Sumatera Selatan</p>
                  </div>
                </div>

                {/* Phone Frame */}
                <div className="phone-frame-wrapper">
                  <div className="phone-frame">
                    <div className="phone-notch">
                      <div className="phone-notch-inner">
                        <div className="phone-camera" />
                        <div className="phone-speaker" />
                      </div>
                    </div>

                    <div className="app-shell">
                      <div className="chrome-browser-ui">
                        <div className="chrome-status-bar">
                          <span>9:41</span>
                          <div className="status-icons">
                            <span style={{ fontSize: 10 }}>5G</span>
                            <div className="battery-icon" />
                          </div>
                        </div>
                        <div className="chrome-nav-bar">
                          <div className="chrome-url-box">
                            <span className="lock-icon">🔒</span>
                            <span className="chrome-url">okirudrink.com</span>
                          </div>
                          <span className="chrome-dots">⋮</span>
                        </div>
                      </div>
                      <div className="browser-viewport">
                        <AnimatedRoutes />
                      </div>
                    </div>

                    <div className="phone-home-indicator">
                      <div className="phone-home-bar" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </BrowserRouter>
    </QueryClientProvider>
  )
}
