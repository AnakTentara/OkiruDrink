import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Coffee } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import './LoyaltyCard.css'

const TOTAL_STAMPS = 3

export default function LoyaltyCard() {
  const { user, addStamp } = useUser()
  const stamps = user?.stamps ?? 0
  const [justAdded, setJustAdded] = useState(false)

  const handleStampClick = () => {
    if (justAdded) return
    addStamp()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  // Build stamp array: 0..2 filled/empty + "Gratis" slot
  const stampSlots = Array.from({ length: TOTAL_STAMPS }, (_, i) => i < stamps)

  return (
    <div className="px-16">
      <div className="loyalty-card">
        <div className="loyalty-header">
          <div>
            <h3 className="loyalty-title">Gratis 1 Cup 🎁</h3>
            <p className="loyalty-desc">Kumpulkan {TOTAL_STAMPS} stamp, dapatkan 1 minuman gratis!</p>
          </div>
          <span className="loyalty-expiry">Berakhir 31 Des 2026</span>
        </div>

        <p className="loyalty-note">* Penggunaan voucher/promo tidak mendapatkan stamp</p>

        <div className="stamps-row">
          {stampSlots.map((filled, i) => (
            <motion.button
              key={i}
              className={`stamp ${filled ? 'filled' : ''}`}
              onClick={handleStampClick}
              whileTap={{ scale: 0.88 }}
              aria-label={`Stamp ${i + 1}`}
            >
              <AnimatePresence mode="wait">
                {filled ? (
                  <motion.div
                    key="filled"
                    className="stamp-inner-filled"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Coffee size={18} color="#fff" />
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="stamp-inner-empty">
                    <Plus size={16} color="var(--neutral-400)" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="stamp-label">Stamp {i + 1}</span>
            </motion.button>
          ))}

          {/* Free slot */}
          <div className={`stamp stamp-free ${stamps >= TOTAL_STAMPS ? 'stamp-free-active' : ''}`}>
            <div className="stamp-free-inner">
              {stamps >= TOTAL_STAMPS
                ? <Check size={20} color="var(--primary-dark)" strokeWidth={3} />
                : <Coffee size={18} color="var(--primary)" />
              }
            </div>
            <span className="stamp-label free-label">Gratis</span>
          </div>
        </div>
      </div>
    </div>
  )
}
