import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import './SubPages.css'

export default function LogoutPage() {
  const { logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="logout-page">
      <motion.div
        className="logout-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <div className="logout-icon">
          <LogOut size={32} color="var(--danger)" />
        </div>
        <h2 className="logout-title">Keluar dari Akun?</h2>
        <p className="logout-desc">
          Kamu akan keluar dari akun OkiruDrink. Data keranjangmu akan tetap tersimpan.
        </p>
        <div className="logout-btns">
          <motion.button
            className="btn btn-full"
            onClick={handleLogout}
            whileTap={{ scale: 0.97 }}
            style={{ background: 'var(--danger)', color: '#fff', border: 'none', gap: 8 }}
          >
            <LogOut size={16} /> Ya, Keluar
          </motion.button>
          <motion.button
            className="btn btn-outline btn-full"
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.97 }}
          >
            Batal
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
