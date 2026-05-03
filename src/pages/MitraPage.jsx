import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Package, Phone, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './SubPages.css'

const benefits = [
  { icon: '💰', title: 'Margin Keuntungan 28–46%', desc: 'Harga mitra Rp6.000/botol, jual ke konsumen Rp8.000. Laba bersih Rp1.700–3.700 per botol!' },
  { icon: '📦', title: 'Minimum Order Fleksibel', desc: 'Mulai dari 50 botol untuk pemula. Semakin banyak, semakin murah harga per botolnya.' },
  { icon: '🚚', title: 'Pengiriman Terjamin', desc: 'Kami siap mengirim ke seluruh wilayah Sumatera Selatan. Untuk luar provinsi, hubungi CS kami.' },
  { icon: '📱', title: 'Dukungan Konten Marketing', desc: 'Dapatkan materi promosi digital siap pakai: foto produk, caption, dan banner untuk sosmed.' },
  { icon: '🤝', title: 'Sistem Kemitraan Transparan', desc: 'Tidak ada biaya keanggotaan. Cukup pesan produk, bayar, dan jual. Sesederhana itu.' },
  { icon: '📈', title: 'Pasar yang Terus Tumbuh', desc: 'Minuman herbal modern adalah tren yang terus naik. Lebih dari 15% anak muda berminat produk herbal sehat.' },
]

const tiers = [
  { name: 'Starter', min: 50, max: 199, price: 6000, badge: null, color: '#78909C', bg: '#ECEFF1' },
  { name: 'Reguler', min: 200, max: 499, price: 5800, badge: '⭐ Populer', color: '#F9A825', bg: '#FFF8E1' },
  { name: 'Premium', min: 500, max: null, price: 5500, badge: '🔥 Terbaik', color: '#2E7D32', bg: '#E8F5E9' },
]

const faqs = [
  { q: 'Apa syarat menjadi mitra OkiruDrink?', a: 'Tidak ada syarat khusus! Siapa saja bisa menjadi mitra. Cukup hubungi CS kami melalui WhatsApp, sepakati order minimum, dan kami siap kirim produk ke lokasimu.' },
  { q: 'Apakah ada biaya pendaftaran?', a: 'Tidak ada biaya pendaftaran sama sekali. Kamu hanya membayar harga produk yang dipesan.' },
  { q: 'Berapa lama ketahanan produk?', a: 'OkiruDrink memiliki masa simpan 6 bulan sejak tanggal produksi jika disimpan di suhu 5–10°C.' },
  { q: 'Apakah tersedia garansi produk?', a: 'Ya! Jika produk diterima dalam kondisi rusak atau tidak sesuai, kami siap ganti 100%.' },
]

export default function MitraPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Program Mitra</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Hero */}
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #1B5E20, #43A047)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 16px',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', right: -40, top: -60 }} />
          <p style={{ fontSize: 36, marginBottom: 8 }}>🤝</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Jadi Mitra OkiruDrink</h2>
          <p style={{ fontSize: 13, opacity: 0.85, color: '#fff', marginTop: 8, lineHeight: 1.6 }}>
            Bangun bisnis minuman herbal bersamaku! ROI tahunan hingga <strong style={{ color: '#A5D6A7' }}>245%</strong> dengan modal yang terjangkau.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['Modal Awal ±Rp30 Juta', 'Balik Modal ±5 Bulan', 'ROI 245%/Tahun'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Harga Grosir Per Tier</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              style={{ background: tier.bg, borderRadius: 'var(--radius-md)', padding: '14px 16px', border: `1.5px solid ${tier.color}22`, display: 'flex', alignItems: 'center', gap: 14 }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: tier.color }}>{tier.name}</span>
                  {tier.badge && <span style={{ fontSize: 10, fontWeight: 700, background: tier.color, color: '#fff', padding: '2px 8px', borderRadius: 99 }}>{tier.badge}</span>}
                </div>
                <p style={{ fontSize: 12, color: 'var(--neutral-500)' }}>
                  {tier.max ? `${tier.min}–${tier.max} botol` : `${tier.min}+ botol`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: tier.color }}>Rp{tier.price.toLocaleString('id-ID')}</p>
                <p style={{ fontSize: 10, color: 'var(--neutral-400)' }}>/ botol</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Keuntungan Menjadi Mitra</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '14px 12px', border: '1px solid var(--neutral-100)', boxShadow: 'var(--shadow-sm)' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <p style={{ fontSize: 24, marginBottom: 8 }}>{b.icon}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-900)', marginBottom: 4, lineHeight: 1.3 }}>{b.title}</p>
              <p style={{ fontSize: 11, color: 'var(--neutral-500)', lineHeight: 1.5 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pertanyaan Umum</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-100)', overflow: 'hidden' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 10 }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--neutral-900)', lineHeight: 1.4 }}>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="var(--primary-dark)" /> : <ChevronDown size={16} color="var(--neutral-400)" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: 12, color: 'var(--neutral-600)', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          onClick={() => window.open('https://wa.me/62895604910792?text=Halo%20OkiruDrink,%20saya%20tertarik%20menjadi%20Mitra%20dan%20ingin%20tahu%20lebih%20lanjut', '_blank')}
          whileTap={{ scale: 0.97 }}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(46,125,50,0.3)', marginBottom: 8 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Phone size={18} /> Daftar Mitra via WhatsApp
        </motion.button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--neutral-400)', fontWeight: 500 }}>Gratis, tanpa biaya pendaftaran 🙌</p>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
