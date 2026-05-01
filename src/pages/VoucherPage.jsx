import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Clock, CheckCircle, Copy, Check, FileText, ChevronRight } from 'lucide-react'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useUser } from '../context/UserContext'
import './VoucherPage.css'

// Fallback vouchers for display (in case user has none)
const displayVouchers = [
  {
    id: 'dv1', title: 'Beli 2 Gratis 1',
    desc: 'Berlaku untuk semua produk OkiruDrink. Tidak berlaku dengan promo lain.',
    terms: 'Berlaku 1x per transaksi. Produk gratis adalah yang termurah. Tidak berlaku untuk produk promo lain. Berlaku di semua outlet.',
    expires: '31 Des 2026', color: '#9BC438', bg: '#EFF8D6', code: 'B2G1FREE',
  },
  {
    id: 'dv2', title: 'Diskon 20% Pertama',
    desc: 'Diskon 20% untuk pembelian pertamamu. Berlaku sekali per akun.',
    terms: 'Hanya berlaku untuk pengguna baru. Minimum pembelian Rp 20.000. Tidak dapat digabungkan dengan voucher lain.',
    expires: '30 Jun 2026', color: '#F5A623', bg: '#FEF3CD', code: 'OKIRU20',
  },
  {
    id: 'dv3', title: 'Gratis Ongkir',
    desc: 'Gratis ongkos kirim untuk pembelian min. Rp 30.000. Area Muara Enim.',
    terms: 'Berlaku untuk mode delivery saja. Area pengiriman maksimal 5 km dari outlet terdekat. Minimum pembelian Rp 30.000.',
    expires: '31 Agu 2026', color: '#6C8EBF', bg: '#E8F0FB', code: 'FREEONGKIR',
  },
]

export default function VoucherPage() {
  const { user } = useUser()
  const userVouchers = user?.vouchers || []
  const [activeTab, setActiveTab] = useState('available')
  const [copiedId, setCopiedId] = useState(null)
  const [expandedTerms, setExpandedTerms] = useState(null)

  // Combine user vouchers + display vouchers (dedup)
  const allVouchers = [
    ...userVouchers,
    ...displayVouchers.filter(dv => !userVouchers.find(uv => uv.id === dv.id))
  ]

  const filtered = activeTab === 'available'
    ? allVouchers.filter(v => !v.used)
    : allVouchers.filter(v => v.used)

  const handleCopy = (code, id) => {
    navigator.clipboard?.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="voucher-page-header px-16">
          <h2>Voucher & Promo 🎟️</h2>
          <p>Klaim dan gunakan voucher spesialmu</p>
        </div>

        <div className="voucher-tabs px-16">
          <button
            className={`vt-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            🎫 Tersedia
            <span className="vt-count">{allVouchers.filter(v => !v.used).length}</span>
          </button>
          <button
            className={`vt-tab ${activeTab === 'used' ? 'active' : ''}`}
            onClick={() => setActiveTab('used')}
          >
            ✓ Terpakai
            <span className="vt-count">{allVouchers.filter(v => v.used).length}</span>
          </button>
        </div>

        <div className="voucher-list px-16">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                className="voucher-empty"
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span style={{ fontSize: 40 }}>🎫</span>
                <p>Belum ada voucher di sini</p>
              </motion.div>
            ) : (
              filtered.map((v, i) => (
                <motion.div
                  key={v.id}
                  className={`voucher-card ${v.used ? 'voucher-used' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  layout
                  style={{ '--vc': v.color, '--vbg': v.bg }}
                >
                  {/* Tear-off effect circles */}
                  <div className="tear-circle tear-top" />
                  <div className="tear-circle tear-bottom" />

                  <div className="vc-left">
                    <div className="vc-icon" style={{ background: v.bg }}>
                      <Tag size={22} color={v.color} />
                    </div>
                    <div className="vc-info">
                      <h3 className="vc-title">{v.title}</h3>
                      <p className="vc-desc">{v.desc}</p>
                      {v.code && (
                        <motion.button
                          className="vc-code-btn"
                          onClick={() => handleCopy(v.code, v.id)}
                          whileTap={{ scale: 0.95 }}
                          style={{ borderColor: v.color }}
                        >
                          <span className="vc-code-text">{v.code}</span>
                          {copiedId === v.id ? (
                            <Check size={12} color="var(--primary-dark)" />
                          ) : (
                            <Copy size={12} color="var(--neutral-400)" />
                          )}
                        </motion.button>
                      )}
                      <span className="vc-expiry">
                        <Clock size={11} /> Berakhir {v.expires}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    id={`use-${v.id}`}
                    className="vc-use-btn"
                    style={{ background: v.used ? 'var(--neutral-400)' : v.color }}
                    whileTap={v.used ? {} : { scale: 0.9 }}
                    disabled={v.used}
                  >
                    {v.used ? <><CheckCircle size={14} /> Dipakai</> : 'Gunakan'}
                  </motion.button>

                  {/* Syarat & Ketentuan */}
                  <div className="vc-terms-section">
                    <button
                      className="vc-terms-toggle"
                      onClick={() => setExpandedTerms(expandedTerms === v.id ? null : v.id)}
                    >
                      <FileText size={12} />
                      Syarat & Ketentuan
                      <ChevronRight
                        size={12}
                        style={{
                          transform: expandedTerms === v.id ? 'rotate(90deg)' : 'none',
                          transition: '0.2s ease'
                        }}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedTerms === v.id && (
                        <motion.div
                          className="vc-terms-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p>{v.terms || 'Berlaku sesuai ketentuan yang berlaku. Voucher tidak dapat diuangkan dan tidak dapat digabung dengan promo lainnya.'}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div style={{ height: 24 }} />
      </main>
      <BottomNav />
    </>
  )
}
