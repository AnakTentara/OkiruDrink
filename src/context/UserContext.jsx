import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const UserContext = createContext()

// ── localStorage "DB" helpers ──
const DB_USERS    = 'okiru_users'
const DB_SESSION  = 'okiru_session'

function getUsers() {
  try { return JSON.parse(localStorage.getItem(DB_USERS)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(DB_USERS, JSON.stringify(users))
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(DB_SESSION)) } catch { return null }
}
function saveSession(user) {
  localStorage.setItem(DB_SESSION, JSON.stringify(user))
}
function clearSession() {
  localStorage.removeItem(DB_SESSION)
}

// ── Leveling system (mirrors server/src/utils/leveling.js) ──
const LEVEL_THRESHOLDS = [
  { level: 'Diamond', min: 5000 },
  { level: 'Gold',    min: 2000 },
  { level: 'Silver',  min: 500  },
  { level: 'Basic',   min: 0    },
]

export function getLevelForPoints(points) {
  for (const { level, min } of LEVEL_THRESHOLDS) {
    if (points >= min) return level
  }
  return 'Basic'
}

export function getLevelInfo(level) {
  const LEVELS = {
    Basic:   { label: 'Okiru Member',   color: '#8B8B8B', icon: '🌱', minPoints: 0,    nextLevel: 'Silver',  nextMin: 500 },
    Silver:  { label: 'Silver Member',  color: '#A8A8A8', icon: '🥈', minPoints: 500,  nextLevel: 'Gold',    nextMin: 2000 },
    Gold:    { label: 'Gold Member',    color: '#D4A017', icon: '🥇', minPoints: 2000, nextLevel: 'Diamond', nextMin: 5000 },
    Diamond: { label: 'Diamond Member', color: '#00BCD4', icon: '💎', minPoints: 5000, nextLevel: null,      nextMin: null },
  }
  return LEVELS[level] || LEVELS.Basic
}

export function getMinPointsForLevel(level) {
  return LEVEL_THRESHOLDS.find(t => t.level === level)?.min ?? 0
}

function checkYearEndDowngrade(user) {
  const currentYear = new Date().getFullYear()
  const expiryYear = user.levelExpiryYear ?? currentYear
  if (currentYear <= expiryYear) return { newLevel: user.level, downgraded: false }

  const required = getMinPointsForLevel(user.level || 'Basic')
  if ((user.points || 0) >= required) return { newLevel: user.level, downgraded: false }

  const idx   = LEVEL_THRESHOLDS.findIndex(t => t.level === user.level)
  const lower = LEVEL_THRESHOLDS[idx + 1]?.level ?? 'Basic'
  return { newLevel: lower, downgraded: true }
}

// ── Default vouchers with S&K ──
const DEFAULT_VOUCHERS = [
  {
    id: 'v1', code: 'OKIRU2026', title: 'Diskon 10% Spesial', 
    desc: 'Hemat 10% untuk semua pesanan', 
    terms: 'Berlaku 1x penggunaan per akun. Tidak dapat digabungkan dengan promo lain. Minimum pembelian Rp 25.000.',
    discountType: 'percent', discountValue: 10, minPurchase: 25000,
    expires: '2026-12-31', used: false, color: '#6A9A1F', bg: 'rgba(155,196,56,0.1)'
  },
  {
    id: 'v2', code: 'WELCOME10K', title: 'Potongan Rp 10.000',
    desc: 'Voucher selamat datang member baru',
    terms: 'Berlaku untuk 1x pembelian pertama. Minimum pembelian Rp 30.000. Tidak dapat diuangkan.',
    discountType: 'fixed', discountValue: 10000, minPurchase: 30000,
    expires: '2026-12-31', used: false, color: '#E67E22', bg: 'rgba(230,126,34,0.1)'
  },
  {
    id: 'v3', code: 'SILVERFREE', title: 'Gratis 1 Minuman',
    desc: 'Gratis 1 botol OkiruDrink Original',
    terms: 'Khusus member Silver ke atas. Berlaku untuk produk Original 200ml saja. Tidak berlaku saat promo lain aktif.',
    discountType: 'fixed', discountValue: 15000, minPurchase: 0, levelRequired: 'Silver',
    expires: '2026-12-31', used: false, color: '#A8A8A8', bg: 'rgba(168,168,168,0.1)'
  },
  {
    id: 'v4', code: 'GOLD20', title: 'Diskon 20% Member Gold',
    desc: 'Diskon eksklusif untuk Member Gold',
    terms: 'Khusus member Gold ke atas. Berlaku untuk semua produk. Minimum pembelian Rp 50.000.',
    discountType: 'percent', discountValue: 20, minPurchase: 50000, levelRequired: 'Gold',
    expires: '2026-12-31', used: false, color: '#D4A017', bg: 'rgba(212,160,23,0.1)'
  },
]

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      // Apply year-end downgrade check on load
      const { newLevel, downgraded } = checkYearEndDowngrade(session)
      if (downgraded) {
        session.level = newLevel
        session.levelExpiryYear = new Date().getFullYear()
        saveSession(session)
        // Also update in users DB
        const users = getUsers()
        const updated = users.map(u => u.id === session.id ? { ...u, level: newLevel, levelExpiryYear: new Date().getFullYear() } : u)
        saveUsers(updated)
      }
      // Recalculate level from points
      const computed = getLevelForPoints(session.points || 0)
      if (computed !== session.level) {
        session.level = computed
        saveSession(session)
      }
      setUser(session)
    }
    setLoading(false)
  }, [])

  // Register — returns { ok, error }
  const register = useCallback(({ name, email, phone, password }) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Email sudah terdaftar.' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      password,          // prototype: plain text (no real security needed)
      points: 0,
      stamps: 0,
      level: 'Basic',
      levelExpiryYear: new Date().getFullYear(),
      joinDate: new Date().toISOString(),
      orders: [],
      vouchers: DEFAULT_VOUCHERS.filter(v => !v.levelRequired).map(v => ({ ...v })),
    }
    saveUsers([...users, newUser])
    // Store pending register for OTP step
    localStorage.setItem('okiru_pending_register', JSON.stringify(newUser))
    return { ok: true }
  }, [])

  // Verify OTP — ANY code accepted for prototype
  const verifyOTP = useCallback((otp) => {
    const pending = JSON.parse(localStorage.getItem('okiru_pending_register') || 'null')
    if (!pending) return { ok: false, error: 'Sesi registrasi tidak ditemukan.' }
    // Any 6-digit code works
    if (otp.length < 4) return { ok: false, error: 'Kode OTP tidak valid.' }
    localStorage.removeItem('okiru_pending_register')
    saveSession(pending)
    setUser(pending)
    return { ok: true }
  }, [])

  // Login
  const login = useCallback(({ email, password }) => {
    const users = getUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Email atau password salah.' }
    // Re-calculate level
    found.level = getLevelForPoints(found.points || 0)
    saveSession(found)
    setUser(found)
    return { ok: true }
  }, [])

  // Logout
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  // Add stamp
  const addStamp = useCallback(() => {
    if (!user) return
    const users = getUsers()
    const updated = users.map(u => {
      if (u.id !== user.id) return u
      const stamps = (u.stamps + 1) % 4
      const points = u.points + 10
      return { ...u, stamps, points }
    })
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession(updatedUser)
    setUser(updatedUser)
  }, [user])

  // Add points
  const addPoints = useCallback((pts) => {
    if (!user) return
    const users = getUsers()
    const updated = users.map(u => {
      if (u.id !== user.id) return u
      const newPoints = u.points + pts
      const newLevel  = getLevelForPoints(newPoints)
      return { ...u, points: newPoints, level: newLevel }
    })
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession(updatedUser)
    setUser(updatedUser)
  }, [user])

  // Add order to history
  const addOrder = useCallback((order) => {
    if (!user) return
    const users = getUsers()
    const updated = users.map(u =>
      u.id === user.id
        ? { ...u, orders: [{ ...order, date: new Date().toISOString() }, ...u.orders] }
        : u
    )
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession(updatedUser)
    setUser(updatedUser)
  }, [user])

  // Use voucher  
  const useVoucher = useCallback((voucherId) => {
    if (!user) return
    const users = getUsers()
    const updated = users.map(u => {
      if (u.id !== user.id) return u
      const vouchers = (u.vouchers || []).map(v =>
        v.id === voucherId ? { ...v, used: true } : v
      )
      return { ...u, vouchers }
    })
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession(updatedUser)
    setUser(updatedUser)
  }, [user])

  // Update profile
  const updateProfile = useCallback((data) => {
    if (!user) return
    const users = getUsers()
    const updated = users.map(u =>
      u.id === user.id ? { ...u, ...data } : u
    )
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession(updatedUser)
    setUser(updatedUser)
  }, [user])

  return (
    <UserContext.Provider value={{
      user, loading, register, verifyOTP, login, logout,
      addStamp, addPoints, addOrder, useVoucher, updateProfile,
      getLevelForPoints, getLevelInfo,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
