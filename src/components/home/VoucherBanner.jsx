import React from 'react'
import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './VoucherBanner.css'

export default function VoucherBanner() {
  const navigate = useNavigate()
  return (
    <div className="px-16">
      <motion.div
        className="voucher-banner"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <div className="voucher-left">
          <div className="voucher-icon-wrap">
            <Tag size={22} color="#fff" />
          </div>
          <div>
            <p className="voucher-title">Beli 2 Gratis 1! 🎉</p>
            <p className="voucher-sub">Berlaku untuk semua produk OkiruDrink</p>
          </div>
        </div>
        <motion.button
          className="btn btn-accent btn-sm voucher-claim-btn"
          onClick={() => navigate('/voucher')}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Klaim
        </motion.button>
      </motion.div>
    </div>
  )
}
