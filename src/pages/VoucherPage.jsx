import React from 'react'
import { motion } from 'framer-motion'
import { Tag, Clock, CheckCircle } from 'lucide-react'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useUser } from '../context/UserContext'
import './VoucherPage.css'

const allVouchers = [
  {
    id: 'v1',
    title: 'Beli 2 Gratis 1',
    desc: 'Berlaku untuk semua produk OkiruDrink. Tidak berlaku dengan promo lain.',
    expires: '31 Des 2026',
    color: '#9BC438',
    bg: '#EFF8D6',
  },
  {
    id: 'v2',
    title: 'Diskon 20% Pertama',
    desc: 'Diskon 20% untuk pembelian pertamamu. Berlaku sekali per akun.',
    expires: '30 Jun 2026',
    color: '#F5A623',
    bg: '#FEF3CD',
  },
  {
    id: 'v3',
    title: 'Gratis Ongkir',
    desc: 'Gratis ongkos kirim untuk pembelian min. Rp 30.000. Area Muara Enim.',
    expires: '31 Agu 2026',
    color: '#6C8EBF',
    bg: '#E8F0FB',
  },
]

export default function VoucherPage() {
  const { user } = useUser()
  const userVouchers = user?.vouchers || []

  // Merge: user vouchers + general ones (dedup by id)
  const shown = [
    ...userVouchers.map(uv => {
      const found = allVouchers.find(av => av.id === uv.id)
      return found ? { ...found, ...uv } : null
    }).filter(Boolean),
    ...allVouchers.filter(av => !userVouchers.find(uv => uv.id === av.id))
  ]

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="voucher-page-header px-16">
          <h2>Voucher & Promo 🎟️</h2>
          <p>Klaim dan gunakan voucher spesialmu</p>
        </div>

        <div className="voucher-list px-16">
          {shown.map((v, i) => (
            <motion.div
              key={v.id}
              className="voucher-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              style={{ '--vc': v.color, '--vbg': v.bg }}
            >
              <div className="vc-left">
                <div className="vc-icon" style={{ background: v.bg }}>
                  <Tag size={22} color={v.color} />
                </div>
                <div className="vc-info">
                  <h3 className="vc-title">{v.title}</h3>
                  <p className="vc-desc">{v.desc}</p>
                  <span className="vc-expiry">
                    <Clock size={11} /> Berakhir {v.expires}
                  </span>
                </div>
              </div>
              <button
                id={`use-${v.id}`}
                className="vc-use-btn"
                style={{ background: v.color }}
              >
                {v.used ? <><CheckCircle size={14} /> Dipakai</> : 'Gunakan'}
              </button>
            </motion.div>
          ))}
        </div>

        <div style={{ height: 24 }} />
      </main>
      <BottomNav />
    </>
  )
}
