import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf, Droplets, Sun, Zap, Shield, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SubPages.css'

const ingredients = [
  {
    name: 'Daun Bangun-Bangun',
    latin: 'Plectranthus amboinicus',
    amount: '7g / botol',
    icon: '🌿',
    color: '#4A7C1F',
    bg: '#EFF8D6',
    benefits: [
      'Kaya antioksidan alami',
      'Meningkatkan daya tahan tubuh',
      'Anti-inflamasi & anti-bakteri',
      'Baik untuk kesehatan pencernaan',
      'Membantu produksi ASI (ibu menyusui)',
    ],
    desc: 'Tanaman herbal lokal Sumatera Selatan yang kaya manfaat. Dikenal sejak ratusan tahun sebagai tanaman obat tradisional yang terbukti secara ilmiah.',
  },
  {
    name: 'Madu Asli',
    latin: 'Natural Honey',
    amount: '6g / botol',
    icon: '🍯',
    color: '#D4891A',
    bg: '#FEF3CD',
    benefits: [
      'Pemanis alami tanpa efek samping',
      'Kaya enzim & mineral penting',
      'Sifat antibakteri alami',
      'Membantu pemulihan energi',
      'Menjaga kelembaban tenggorokan',
    ],
    desc: 'Madu pilihan berkualitas tinggi yang menggantikan gula rafinasi. Memberikan rasa manis alami sekaligus menutrisi tubuh.',
  },
  {
    name: 'Sereh',
    latin: 'Cymbopogon citratus',
    amount: '2g / botol',
    icon: '🌾',
    color: '#6B8E23',
    bg: '#F0F4E8',
    benefits: [
      'Aroma segar alami khas',
      'Membantu meredakan stres',
      'Efek detoksifikasi ringan',
      'Melancarkan sirkulasi darah',
    ],
    desc: 'Sereh memberikan aroma khas yang menyegarkan dan membantu proses detoksifikasi tubuh secara alami.',
  },
  {
    name: 'Stevia',
    latin: 'Stevia rebaudiana',
    amount: '0,05g / botol',
    icon: '🍃',
    color: '#2E7D32',
    bg: '#E8F5E9',
    benefits: [
      'Pemanis zero-calorie',
      'Aman untuk penderita diabetes',
      'Tidak merusak gigi',
      'Indeks glikemik = 0',
    ],
    desc: 'Pemanis alami 200x lebih manis dari gula biasa namun dengan nol kalori. Aman untuk semua kalangan termasuk diabetesi.',
  },
  {
    name: 'Lemon',
    latin: 'Citrus limon',
    amount: '5g / botol',
    icon: '🍋',
    color: '#F9A825',
    bg: '#FFFDE7',
    benefits: [
      'Tinggi Vitamin C alami',
      'Memperkuat sistem imun',
      'Memberikan kesegaran rasa',
      'Antioksidan kuat',
    ],
    desc: 'Lemon segar memberikan rasa asam yang menyeimbangkan cita rasa sekaligus meningkatkan kandungan Vitamin C dalam setiap botol.',
  },
  {
    name: 'Air Murni (PDAM)',
    latin: 'Aqua purificata',
    amount: '250ml / botol',
    icon: '💧',
    color: '#0277BD',
    bg: '#E1F5FE',
    benefits: [
      'Air mineral berkualitas tinggi',
      'Diproses higienis & terstandar',
      'Bebas bakteri & kontaminan',
    ],
    desc: 'Air PDAM yang telah melalui proses filtrasi dan sterilisasi ketat untuk memastikan kemurnian dan keamanan produk.',
  },
]

const certifications = [
  { icon: '✅', label: 'Halal', sub: 'Bahan alami & proses halal' },
  { icon: '🏥', label: 'BPOM', sub: 'Terdaftar BPOM RI' },
  { icon: '🌱', label: 'Organik', sub: 'Bahan baku lokal organik' },
  { icon: '♻️', label: 'Eco-Pack', sub: 'Kemasan PET daur ulang' },
]

export default function IngredientsPage() {
  const navigate = useNavigate()

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Bahan & Manfaat</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Hero Banner */}
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 16px',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 20,
          }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={{ fontSize: 28 }}>🌿</p>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 6 }}>6 Bahan Alami Pilihan</h2>
          <p style={{ fontSize: 12, opacity: 0.85, color: '#fff', marginTop: 4 }}>Setiap botol OkiruDrink dibuat dari bahan herbal berkualitas, dipilih dengan teliti dari petani lokal Sumatera Selatan</p>
        </motion.div>

        {/* Certifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {certifications.map((c, i) => (
            <motion.div
              key={c.label}
              style={{ background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '10px 6px', textAlign: 'center', border: '1px solid var(--neutral-100)', boxShadow: 'var(--shadow-sm)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div style={{ fontSize: 20 }}>{c.icon}</div>
              <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--neutral-900)', marginTop: 4 }}>{c.label}</p>
              <p style={{ fontSize: 9, color: 'var(--neutral-400)', lineHeight: 1.3 }}>{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Ingredients List */}
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Komposisi Produk</h3>
        {ingredients.map((ing, i) => (
          <motion.div
            key={ing.name}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: 12,
              border: '1px solid var(--neutral-100)',
              boxShadow: 'var(--shadow-sm)',
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
          >
            {/* Header */}
            <div style={{ background: ing.bg, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>{ing.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: ing.color }}>{ing.name}</p>
                <p style={{ fontSize: 11, color: 'var(--neutral-500)', fontStyle: 'italic' }}>{ing.latin}</p>
              </div>
              <div style={{ background: ing.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                {ing.amount}
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 12, color: 'var(--neutral-600)', lineHeight: 1.6, marginBottom: 10 }}>{ing.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ing.benefits.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ing.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--neutral-700)', fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Nutrition Note */}
        <motion.div
          style={{ background: 'var(--primary-xlight)', border: '1px solid rgba(155,196,56,0.3)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginTop: 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p style={{ fontSize: 12, color: 'var(--primary-dark)', fontWeight: 600, lineHeight: 1.6 }}>
            💡 <strong>Tanpa Pengawet, Tanpa Pewarna Buatan.</strong> OkiruDrink dibuat segar setiap batch produksi dengan kapasitas 5.000 botol/bulan untuk menjaga kualitas tetap prima.
          </p>
        </motion.div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
