import React from 'react'
import { motion } from 'framer-motion'
import { LogOut, Package, MapPin, Star, ChevronRight, Leaf, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useUser } from '../context/UserContext'
import './ProfilePage.css'

const menuItems = [
  { icon: Package,  label: 'Riwayat Pesanan', id: 'nav-orders' },
  { icon: MapPin,   label: 'Alamat Pengiriman', id: 'nav-address' },
  { icon: Star,     label: 'Program Loyalitas', id: 'nav-loyalty' },
  { icon: Shield,   label: 'Keamanan Akun', id: 'nav-security' },
  { icon: Leaf,     label: 'Tentang OkiruDrink', id: 'nav-about' },
]

export default function ProfilePage() {
  const { user, logout } = useUser()
  const navigate          = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const orders = user?.orders || []

  return (
    <>
      <Header />
      <main className="page-content">

        {/* Profile Card */}
        <motion.div
          className="profile-card px-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-avatar">
            {(user?.name?.[0] || 'O').toUpperCase()}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user?.name || 'Pengguna'}</h2>
            <p className="profile-email">{user?.email || ''}</p>
            <div className="profile-level">
              <Leaf size={12} />
              {user?.level || 'Okiru Member'}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="profile-stats px-16">
          {[
            { label: 'Total Poin',   value: `${user?.points ?? 0} pts`, icon: '🌟' },
            { label: 'Stamp',        value: `${user?.stamps ?? 0}/3`,   icon: '☕' },
            { label: 'Pesanan',      value: orders.length,              icon: '📦' },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div style={{ padding: '0 16px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Pesanan Terakhir</h3>
            {orders.slice(0, 2).map((o, i) => (
              <div key={i} className="order-row">
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{o.items?.length ?? 0} item</p>
                  <p style={{ fontSize: 11, color: 'var(--neutral-400)' }}>
                    {new Date(o.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>
                  Rp {o.total?.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Menu Items */}
        <div className="profile-menu px-16">
          {menuItems.map(({ icon: Icon, label, id }) => (
            <motion.button
              key={id}
              id={id}
              className="profile-menu-item"
              whileTap={{ scale: 0.98 }}
            >
              <div className="pmi-left">
                <div className="pmi-icon">
                  <Icon size={18} color="var(--primary-dark)" />
                </div>
                <span className="pmi-label">{label}</span>
              </div>
              <ChevronRight size={16} color="var(--neutral-400)" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <div className="px-16" style={{ marginTop: 8 }}>
          <motion.button
            id="btn-logout"
            className="btn btn-outline btn-full"
            onClick={handleLogout}
            whileTap={{ scale: 0.97 }}
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)', gap: 8 }}
          >
            <LogOut size={16} /> Keluar dari Akun
          </motion.button>
        </div>

        <div style={{ height: 24 }} />
      </main>
      <BottomNav />
    </>
  )
}
