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

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) setUser(session)
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
      level: 'Okiru Member',
      joinDate: new Date().toISOString(),
      orders: [],
      vouchers: [
        { id: 'v1', title: 'Beli 2 Gratis 1', desc: 'Berlaku untuk semua produk OkiruDrink', expires: '2026-12-31', used: false }
      ],
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
    const updated = users.map(u =>
      u.id === user.id ? { ...u, points: u.points + pts } : u
    )
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

  return (
    <UserContext.Provider value={{ user, loading, register, verifyOTP, login, logout, addStamp, addPoints, addOrder }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
