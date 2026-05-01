import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './SubPages.css'

// Simple deterministic QR-like grid
function generateQRGrid(seed) {
  const cells = []
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  for (let i = 0; i < 64; i++) {
    const val = ((hash * (i + 1) * 7) >>> 0) % 100
    // corners always filled (QR positioning)
    const row = Math.floor(i / 8), col = i % 8
    const isCorner = (row < 2 && col < 2) || (row < 2 && col > 5) || (row > 5 && col < 2)
    cells.push(isCorner || val < 45)
  }
  return cells
}

export default function QRCodePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const memberId = `OKR-${(user?.id || Date.now()).toString().slice(-6)}`

  const qrCells = useMemo(() => generateQRGrid(memberId), [memberId])

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Kode QR</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          className="qr-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        >
          <div className="qr-placeholder">
            <div className="qr-grid">
              {qrCells.map((filled, i) => (
                <motion.div
                  key={i}
                  className="qr-cell"
                  style={{ background: filled ? 'var(--neutral-900)' : 'transparent' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.008 }}
                />
              ))}
            </div>
          </div>

          <p className="qr-member-id">{memberId}</p>
          <p className="qr-sub">Tunjukkan kode ini ke kasir untuk mendapatkan stamp</p>
        </motion.div>

        {/* User info */}
        <motion.div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            width: '100%',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--neutral-900)', marginBottom: 4 }}>
            {user?.name || 'Pengguna'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--neutral-400)' }}>{user?.email || ''}</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'var(--primary-xlight)', color: 'var(--primary-dark)',
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            fontSize: 11, fontWeight: 700, marginTop: 8,
          }}>
            🌿 {user?.level || 'Okiru Member'}
          </div>
        </motion.div>

        <motion.button
          className="btn btn-outline btn-full"
          style={{ marginTop: 16, gap: 8 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Download size={16} /> Simpan QR Code
        </motion.button>
      </div>
    </div>
  )
}
