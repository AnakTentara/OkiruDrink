import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import './LandingPage.css'

const features = [
  { icon: '🌿', title: '100% Bahan Alami', desc: 'Daun bangun-bangun, madu, sereh, stevia & lemon. Zero pengawet.' },
  { icon: '⚡', title: 'Ready to Drink', desc: '250ml siap minum, praktis dibawa ke mana saja kapan saja.' },
  { icon: '🫀', title: 'Kaya Manfaat', desc: 'Antioksidan tinggi, baik untuk pencernaan & daya tahan tubuh.' },
  { icon: '💰', title: 'Harga Terjangkau', desc: 'Hanya Rp8.000/botol. Sehat tidak harus mahal!' },
]

const stats = [
  { value: '5.000+', label: 'Botol / Bulan' },
  { value: '250ml', label: 'Per Botol' },
  { value: '6', label: 'Bahan Alami' },
  { value: 'Rp8K', label: 'Per Botol' },
]

const ingredients = [
  { emoji: '🌿', name: 'Bangun-bangun' },
  { emoji: '🍯', name: 'Madu Asli' },
  { emoji: '🌾', name: 'Sereh' },
  { emoji: '🍃', name: 'Stevia' },
  { emoji: '🍋', name: 'Lemon' },
  { emoji: '💧', name: 'Air Murni' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useUserStore()

  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  if (user) return null

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="ln-brand">
          <img src="/logo.jpg" alt="OkiruDrink" className="ln-logo" />
          <span className="ln-name">OkiruDrink</span>
        </div>
        <div className="ln-actions">
          <button className="ln-btn-outline" onClick={() => navigate('/login')}>Masuk</button>
          <button className="ln-btn-solid" onClick={() => navigate('/register')}>Daftar</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <motion.div
          className="lh-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="lh-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            🌿 Minuman Herbal Kekinian
          </motion.div>
          <h1 className="lh-headline">
            Sehat itu <br/>
            <span className="lh-highlight">Tasty.</span>
          </h1>
          <p className="lh-sub">
            OkiruDrink hadir dari hati bumi Sumatera Selatan. Minuman herbal alami yang enak, praktis, dan terjangkau untuk gaya hidupmu.
          </p>
          <div className="lh-cta-row">
            <motion.button
              className="lh-cta-primary"
              onClick={() => navigate('/register')}
              whileTap={{ scale: 0.96 }}
            >
              🍵 Drink Now!
            </motion.button>
            <motion.button
              className="lh-cta-secondary"
              onClick={() => navigate('/login')}
              whileTap={{ scale: 0.96 }}
            >
              Sudah punya akun?
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="lh-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="lh-bottle-glow" />
          <img src="/logo.jpg" alt="OkiruDrink Bottle" className="lh-bottle-img" />
          <div className="lh-float-tag lh-tag-1">🌿 Herbal</div>
          <div className="lh-float-tag lh-tag-2">✅ BPOM</div>
          <div className="lh-float-tag lh-tag-3">💚 Halal</div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <motion.div
        className="landing-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {stats.map((s, i) => (
          <div key={s.label} className="ls-item">
            <span className="ls-value">{s.value}</span>
            <span className="ls-label">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Features */}
      <section className="landing-features">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Kenapa OkiruDrink?</h2>
          <p className="section-sub">Bukan sekadar minuman biasa</p>
        </motion.div>
        <div className="lf-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="lf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="lf-icon">{f.icon}</span>
              <h3 className="lf-title">{f.title}</h3>
              <p className="lf-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="landing-ingredients">
        <motion.div
          className="li-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title" style={{ color: '#fff' }}>6 Bahan Pilihan Alam</h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.75)' }}>Dipilih dari petani lokal Sumatera Selatan</p>
          <div className="li-pills">
            {ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                className="li-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span>{ing.emoji}</span>
                <span>{ing.name}</span>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>
            Tanpa pengawet • Tanpa pewarna buatan • Tanpa pemanis kimia
          </p>
        </motion.div>
      </section>

      {/* Origin Story */}
      <section className="landing-story">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="ls-content"
        >
          <span className="ls-location">📍 Muara Enim, Sumatera Selatan</span>
          <h2 className="section-title">Lahir dari Bumi Sumatera</h2>
          <p className="ls-story">
            OkiruDrink berawal dari kecintaan terhadap tanaman herbal lokal. Daun <em>Plectranthus amboinicus</em> (bangun-bangun) yang tumbuh subur di Sumatera Selatan, dipadukan dengan madu asli dan bahan alami lainnya, diolah menjadi minuman modern yang tidak hanya menyehatkan, tapi juga benar-benar enak diminum.
          </p>
          <p className="ls-story" style={{ marginTop: 12 }}>
            Dengan kapasitas produksi <strong>5.000 botol/bulan</strong> dan target ekspansi dari lokal ke nasional, OkiruDrink berkomitmen untuk membawa kesehatan alami ke tangan semua kalangan.
          </p>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            Siap Merasakannya?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>
            Daftar sekarang dan dapatkan voucher selamat datang!
          </p>
          <motion.button
            className="lh-cta-primary"
            onClick={() => navigate('/register')}
            whileTap={{ scale: 0.96 }}
            style={{ fontSize: 16, padding: '14px 32px' }}
          >
            🍵 Mulai Sekarang — Gratis!
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 OkiruDrink — Muara Enim, Sumatera Selatan</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>Healthy but Tasty 🌿</p>
      </footer>
    </div>
  )
}
