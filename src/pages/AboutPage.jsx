import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Phone, Mail, Leaf, TrendingUp, Users, Package, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SubPages.css'

const stats = [
  { icon: '🍶', label: 'Kapasitas Produksi', value: '5.000', sub: 'botol / bulan' },
  { icon: '🎯', label: 'Target Pasar', value: '15–30', sub: 'tahun' },
  { icon: '📈', label: 'ROI Tahunan', value: '245%', sub: 'per tahun' },
  { icon: '⚡', label: 'Balik Modal', value: '±5', sub: 'bulan' },
]

const highlights = [
  { icon: '🌿', title: 'Bahan 100% Alami', desc: '6 bahan herbal pilihan tanpa pengawet & pewarna buatan', path: '/ingredients' },
  { icon: '🤝', title: 'Program Mitra', desc: 'Jadi agen reseller dengan margin 28–46% per botol', path: '/mitra' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Tentang OkiruDrink</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Hero */}
        <motion.div className="about-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <img src="/logo.jpg" alt="OkiruDrink" className="about-logo" />
          <span className="about-brand">OkiruDrink</span>
          <span style={{ fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600, marginTop: 4 }}>Healthy but Tasty 🌿</span>
          <span className="about-version" style={{ marginTop: 4 }}>Muara Enim, Sumatera Selatan</span>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '14px', border: '1px solid var(--neutral-100)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
            >
              <p style={{ fontSize: 22 }}>{s.icon}</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary-dark)', lineHeight: 1.1, marginTop: 4 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--neutral-400)', fontWeight: 500 }}>{s.sub}</p>
              <p style={{ fontSize: 10, color: 'var(--neutral-500)', fontWeight: 600, marginTop: 2 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* About */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3>🍃 Apa itu OkiruDrink?</h3>
          <p>
            OkiruDrink adalah minuman herbal kekinian <em>Ready-to-Drink</em> berukuran <strong>250ml</strong> yang dirancang khusus untuk generasi muda usia 15–30 tahun. Dibuat dari <strong>Daun Bangun-bangun (Plectranthus amboinicus)</strong>, madu, sereh, stevia, dan lemon — semua bahan alami tanpa pengawet.
          </p>
          <p style={{ marginTop: 8 }}>
            Diproduksi langsung di <strong>Muara Enim, Sumatera Selatan</strong> dengan standar produksi higienis dan terstandar, OkiruDrink hadir dengan harga terjangkau <strong>Rp8.000/botol</strong> untuk memberikan pilihan minuman sehat yang tidak membosankan.
          </p>
        </motion.div>

        {/* Visi Misi */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3>🎯 Visi & Misi</h3>
          <p style={{ fontWeight: 700, color: 'var(--neutral-900)', marginBottom: 4 }}>Visi:</p>
          <p style={{ marginBottom: 10 }}>Menjadi merek minuman herbal modern terpercaya dari Sumatera Selatan yang hadir secara nasional.</p>
          <p style={{ fontWeight: 700, color: 'var(--neutral-900)', marginBottom: 4 }}>Misi:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Menghadirkan minuman herbal alami yang enak & terjangkau',
              'Mendukung petani lokal rempah Sumatera Selatan',
              'Edukasi gaya hidup sehat untuk generasi muda',
              'Ekspansi dari lokal (Semende-Muara Enim) ke nasional',
            ].map(m => (
              <div key={m} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--primary-dark)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: 'var(--neutral-700)', lineHeight: 1.4 }}>{m}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Benefits */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3>🫀 Manfaat Kesehatan</h3>
          <p>Daun Bangun-bangun kaya antioksidan, baik untuk pencernaan, meningkatkan daya tahan tubuh, serta mengandung senyawa anti-inflamasi alami. Dengan pemanis Stevia (nol kalori), OkiruDrink aman untuk semua kalangan termasuk diabetesi.</p>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {highlights.map(h => (
            <button
              key={h.path}
              onClick={() => navigate(h.path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginBottom: 8, boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font)', textAlign: 'left' }}
            >
              <span style={{ fontSize: 24 }}>{h.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{h.title}</p>
                <p style={{ fontSize: 11, color: 'var(--neutral-500)' }}>{h.desc}</p>
              </div>
              <ChevronRight size={16} color="var(--neutral-300)" />
            </button>
          ))}
        </motion.div>

        {/* Product Info */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3>📋 Informasi Produk</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {[
              ['Isi / Botol', '250ml (RTD — Ready to Drink)'],
              ['Harga Eceran', 'Rp8.000 / botol'],
              ['HPP Produksi', 'Rp4.300 / botol'],
              ['Sertifikasi', 'BPOM Terdaftar ✓'],
              ['Halal', 'Halal & Aman ✓'],
              ['Kemasan', 'Botol PET 250ml — dapat didaur ulang ♻️'],
              ['Penyimpanan', 'Simpan di suhu 5–10°C'],
              ['Masa Berlaku', '6 bulan sejak tanggal produksi'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--neutral-100)' }}>
                <span style={{ fontSize: 12, color: 'var(--neutral-500)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-900)', textAlign: 'right', maxWidth: '55%' }}>{val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3>📞 Kontak</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {[
              { Icon: MapPin, text: 'Muara Enim, Sumatera Selatan' },
              { Icon: Phone, text: '+62 812-3456-7890' },
              { Icon: Mail, text: 'hello@okirudrink.id' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={16} color="var(--primary-dark)" />
                <span style={{ fontSize: 13, color: 'var(--neutral-600)' }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--neutral-400)', marginTop: 16, fontWeight: 600 }}>
          © 2026 OkiruDrink — Muara Enim, Sumatera Selatan
        </p>
        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
