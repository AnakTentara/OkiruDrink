import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import './LandingPage.css'

const ingredients = [
  { emoji: '🌿', name: 'Daun Bangun-Bangun', latin: 'Plectranthus amboinicus', benefit: 'Antioksidan tinggi & anti-inflamasi alami', color: '#4A7C1F', bg: '#EFF8D6' },
  { emoji: '🍯', name: 'Madu Asli', latin: 'Natural Honey', benefit: 'Pemanis alami kaya enzim & antibakteri', color: '#D4891A', bg: '#FEF3CD' },
  { emoji: '🌾', name: 'Sereh', latin: 'Cymbopogon citratus', benefit: 'Aroma segar & efek detoksifikasi', color: '#6B8E23', bg: '#F0F4E8' },
  { emoji: '🍃', name: 'Stevia', latin: 'Stevia rebaudiana', benefit: 'Zero kalori, aman untuk diabetesi', color: '#2E7D32', bg: '#E8F5E9' },
  { emoji: '🍋', name: 'Lemon Segar', latin: 'Citrus limon', benefit: 'Tinggi Vitamin C & antioksidan kuat', color: '#F9A825', bg: '#FFFDE7' },
  { emoji: '💧', name: 'Air Murni', latin: 'Aqua purificata', benefit: 'Diproses higienis & terstandar', color: '#0277BD', bg: '#E1F5FE' },
]

const stats = [
  { value: '5.000+', label: 'Botol per Bulan', icon: '🍶' },
  { value: '250ml', label: 'Volume per Botol', icon: '📦' },
  { value: '6', label: 'Bahan Alami', icon: '🌿' },
  { value: 'Rp8.000', label: 'Harga per Botol', icon: '💰' },
  { value: '±5 bln', label: 'Balik Modal', icon: '📈' },
  { value: '245%', label: 'ROI per Tahun', icon: '🚀' },
]

const steps = [
  { step: '01', icon: '📱', title: 'Daftar Akun', desc: 'Buat akun gratis dalam 30 detik. Tidak perlu kartu kredit.' },
  { step: '02', icon: '🛒', title: 'Pilih Produk', desc: 'Jelajahi menu OkiruDrink dan tambahkan ke keranjang.' },
  { step: '03', icon: '🚚', title: 'Pesan & Nikmati', desc: 'Konfirmasi pesanan dan nikmati kesegaran herbal alami.' },
]

const testimonials = [
  { name: 'Ratu A.', role: 'Mahasiswi UNSRI', avatar: '👩‍🎓', text: 'Enak banget! Rasanya segar, ga kayak minuman herbal yang biasanya pahit. Cocok buat teman belajar!', stars: 5 },
  { name: 'Budi S.', role: 'Pegawai Swasta', avatar: '👨‍💼', text: 'Rutin minum tiap pagi, badan terasa lebih fit. Harganya terjangkau banget untuk minuman sesehat ini.', stars: 5 },
  { name: 'Fitri N.', role: 'Ibu Rumah Tangga', avatar: '👩', text: 'Anak-anak suka! Saya senang ada minuman sehat yang rasanya enak dan aman untuk seluruh keluarga.', stars: 5 },
]

const navLinks = [
  { label: 'Produk', href: '#features' },
  { label: 'Bahan', href: '#ingredients' },
  { label: 'Cara Order', href: '#how' },
  { label: 'Tentang', href: '#story' },
]

function StarRating({ count }) {
  return <div className="star-rating">{'⭐'.repeat(count)}</div>
}

function NavLink({ href, label }) {
  return (
    <a
      href={href}
      className="lp-navlink"
      onClick={e => {
        e.preventDefault()
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      {label}
    </a>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (user) return null

  return (
    <div className="lp-root">
      {/* ── Sticky Navbar ── */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <img src="/logo.jpg" alt="OkiruDrink" className="lp-nav-logo" />
            <span className="lp-brand-name">OkiruDrink</span>
          </div>
          <div className="lp-nav-links">
            {navLinks.map(l => <NavLink key={l.href} {...l} />)}
          </div>
          <div className="lp-nav-cta">
            <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Masuk</button>
            <button className="lp-btn-primary" onClick={() => navigate('/register')}>Daftar Gratis</button>
          </div>
        </div>
      </nav>

      {/* ══ SECTION 1: HERO ══ */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero-bg" />
        <div className="lp-container lp-hero-inner">
          <motion.div
            className="lp-hero-text"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.span className="lp-hero-badge" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              🌿 Minuman Herbal Kekinian dari Sumatera Selatan
            </motion.span>
            <h1 className="lp-hero-headline">
              Sehat Itu
              <br />
              <span className="lp-hero-accent">Tasty.</span>
            </h1>
            <p className="lp-hero-desc">
              OkiruDrink hadir dari hati bumi Sumatera Selatan. Minuman herbal alami yang enak, praktis, dan terjangkau — hanya <strong>Rp8.000/botol</strong>. Dibuat dari 6 bahan alami pilihan, tanpa pengawet, tanpa pewarna buatan.
            </p>
            <div className="lp-hero-actions">
              <motion.button className="lp-btn-hero" onClick={() => navigate('/register')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                🍵 Drink Now!
              </motion.button>
              <button className="lp-btn-hero-outline" onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}>
                Pelajari Lebih →
              </button>
            </div>
            <div className="lp-hero-badges">
              {['✅ BPOM Terdaftar', '🌿 Halal & Aman', '♻️ Kemasan Ramah Lingkungan'].map(b => (
                <span key={b} className="lp-hero-badge-chip">{b}</span>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="lp-hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="lp-product-card">
              <div className="lp-product-glow" />
              <img src="/logo.jpg" alt="OkiruDrink" className="lp-product-img" />
              <div className="lp-float-tags">
                <span className="lp-ftag lp-ftag-1">🌿 Herbal</span>
                <span className="lp-ftag lp-ftag-2">✅ BPOM</span>
                <span className="lp-ftag lp-ftag-3">💚 Halal</span>
                <span className="lp-ftag lp-ftag-4">⭐ No. 1</span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="lp-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff"/></svg>
        </div>
      </section>

      {/* ══ SECTION 2: STATS ══ */}
      <section className="lp-stats-bar">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="lp-stat-item"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="lp-stat-icon">{s.icon}</span>
                <span className="lp-stat-value">{s.value}</span>
                <span className="lp-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3: FEATURES ══ */}
      <section className="lp-section" id="features">
        <div className="lp-container">
          <motion.div className="lp-section-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="lp-section-badge">Kenapa OkiruDrink?</span>
            <h2 className="lp-section-title">Bukan Sekadar Minuman Biasa</h2>
            <p className="lp-section-sub">Kami menggabungkan kearifan herbal lokal dengan kemasan modern yang praktis</p>
          </motion.div>
          <div className="lp-features-grid">
            {[
              { icon: '🌿', title: '100% Bahan Alami', desc: 'Enam bahan herbal pilihan dari petani lokal Sumatera Selatan. Zero pengawet, zero pewarna buatan.', color: '#4A7C1F' },
              { icon: '⚡', title: 'Ready to Drink', desc: '250ml siap minum langsung dari botol. Praktis dibawa ke kampus, kantor, atau gym.', color: '#F9A825' },
              { icon: '🫀', title: 'Kaya Manfaat', desc: 'Antioksidan tinggi, baik untuk pencernaan, meningkatkan imunitas, dan anti-inflamasi alami.', color: '#E53935' },
              { icon: '💰', title: 'Harga Terjangkau', desc: 'Hanya Rp8.000/botol. Sehat dan menyegarkan tidak harus mahal!', color: '#2196F3' },
              { icon: '🔬', title: 'Teruji & Terdaftar', desc: 'Produk telah melalui uji standar keamanan pangan dan terdaftar di BPOM RI.', color: '#9C27B0' },
              { icon: '♻️', title: 'Ramah Lingkungan', desc: 'Dikemas dalam botol PET 250ml food grade yang bisa didaur ulang. Peduli bumi, peduli generasi.', color: '#00897B' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="lp-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
              >
                <div className="lp-fc-icon" style={{ background: f.color + '18' }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                </div>
                <h3 className="lp-fc-title">{f.title}</h3>
                <p className="lp-fc-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4: INGREDIENTS ══ */}
      <section className="lp-section lp-ing-section" id="ingredients">
        <div className="lp-ing-bg" />
        <div className="lp-container">
          <motion.div className="lp-section-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="lp-section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Komposisi</span>
            <h2 className="lp-section-title" style={{ color: '#fff' }}>6 Bahan Pilihan Alam</h2>
            <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.75)' }}>Dipilih dengan teliti dari petani lokal Sumatera Selatan. Setiap bahan punya peran dan manfaatnya sendiri.</p>
          </motion.div>
          <div className="lp-ing-grid">
            {ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                className="lp-ing-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="lp-ing-icon-wrap" style={{ background: ing.bg }}>
                  <span className="lp-ing-emoji">{ing.emoji}</span>
                </div>
                <div className="lp-ing-info">
                  <p className="lp-ing-name">{ing.name}</p>
                  <p className="lp-ing-latin">{ing.latin}</p>
                  <p className="lp-ing-benefit">{ing.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="lp-ing-note"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            🚫 Tanpa Pengawet &nbsp;•&nbsp; 🚫 Tanpa Pewarna Buatan &nbsp;•&nbsp; 🚫 Tanpa Pemanis Kimia
          </motion.p>
        </div>
      </section>

      {/* ══ SECTION 5: HOW IT WORKS ══ */}
      <section className="lp-section" id="how">
        <div className="lp-container">
          <motion.div className="lp-section-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="lp-section-badge">Cara Order</span>
            <h2 className="lp-section-title">Mulai dalam 3 Langkah</h2>
            <p className="lp-section-sub">Simpel, cepat, dan bisa dilakukan kapan saja</p>
          </motion.div>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="lp-step"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="lp-step-num">{s.step}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="lp-step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 6: STORY ══ */}
      <section className="lp-section lp-story-section" id="story">
        <div className="lp-container lp-story-inner">
          <motion.div
            className="lp-story-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="lp-section-badge">Asal Usul</span>
            <h2 className="lp-section-title">Lahir dari Bumi Sumatera</h2>
            <p className="lp-story-body">
              OkiruDrink berawal dari kecintaan mendalam terhadap tanaman herbal lokal. <em>Plectranthus amboinicus</em> — dikenal masyarakat Sumatera Selatan sebagai "daun bangun-bangun" — tumbuh subur di tanah Semende dan Muara Enim.
            </p>
            <p className="lp-story-body" style={{ marginTop: 16 }}>
              Kami mengolahnya menjadi minuman modern yang tidak hanya menyehatkan, tapi juga benar-benar <strong>enak diminum</strong>. Dengan kapasitas produksi <strong>5.000 botol/bulan</strong> dan target ekspansi dari lokal ke nasional, OkiruDrink siap membawa kesehatan alami ke tangan semua kalangan.
            </p>
            <div className="lp-story-facts">
              {[
                { icon: '📍', label: 'Produksi', value: 'Muara Enim, Sumatera Selatan' },
                { icon: '🎯', label: 'Target Pasar', value: 'Usia 15–30 tahun' },
                { icon: '🌱', label: 'Filosofi', value: 'Lokal, Sehat, Terjangkau' },
              ].map(f => (
                <div key={f.label} className="lp-story-fact">
                  <span className="lp-sf-icon">{f.icon}</span>
                  <div>
                    <p className="lp-sf-label">{f.label}</p>
                    <p className="lp-sf-value">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="lp-story-visual"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="lp-story-map-card">
              <div className="lp-map-placeholder">
                <span style={{ fontSize: 64 }}>🗺️</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#4A7C1F', marginTop: 12 }}>Muara Enim</p>
                <p style={{ fontSize: 12, color: '#666' }}>Sumatera Selatan, Indonesia</p>
                <div className="lp-map-ping" />
              </div>
              <div className="lp-story-stat-row">
                <div className="lp-ss-item"><span>🏭</span><strong>1</strong><small>Fasilitas Produksi</small></div>
                <div className="lp-ss-item"><span>👥</span><strong>2+</strong><small>Tim Produksi</small></div>
                <div className="lp-ss-item"><span>📅</span><strong>2026</strong><small>Tahun Berdiri</small></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SECTION 7: TESTIMONIALS ══ */}
      <section className="lp-section lp-testi-section">
        <div className="lp-container">
          <motion.div className="lp-section-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="lp-section-badge">Testimoni</span>
            <h2 className="lp-section-title">Kata Mereka</h2>
            <p className="lp-section-sub">Bergabung dengan ribuan pelanggan yang sudah merasakan manfaatnya</p>
          </motion.div>
          <div className="lp-testi-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="lp-testi-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <StarRating count={t.stars} />
                <p className="lp-testi-text">"{t.text}"</p>
                <div className="lp-testi-author">
                  <span className="lp-testi-avatar">{t.avatar}</span>
                  <div>
                    <p className="lp-testi-name">{t.name}</p>
                    <p className="lp-testi-role">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 8: LOYALTY TEASER ══ */}
      <section className="lp-loyalty-section">
        <div className="lp-container">
          <div className="lp-loyalty-inner">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Program Loyalitas Member 🏆</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 24 }}>Kumpulkan poin setiap pembelian. Tukar dengan hadiah menarik!</p>
              <div className="lp-loyalty-tiers">
                {[
                  { name: 'Member', icon: '🌱', pts: '0 pts', color: '#9BC438' },
                  { name: 'Silver', icon: '🥈', pts: '500 pts', color: '#78909C' },
                  { name: 'Gold', icon: '🥇', pts: '2.000 pts', color: '#F9A825' },
                  { name: 'Diamond', icon: '💎', pts: '5.000 pts', color: '#26C6DA' },
                ].map(t => (
                  <div key={t.name} className="lp-tier" style={{ borderColor: t.color + '60' }}>
                    <span style={{ fontSize: 24 }}>{t.icon}</span>
                    <p style={{ fontWeight: 700, color: t.color, fontSize: 13 }}>{t.name}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{t.pts}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 9: FINAL CTA ══ */}
      <section className="lp-cta-section">
        <div className="lp-container" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="lp-cta-headline">Siap Merasakan Bedanya?</h2>
            <p className="lp-cta-sub">Daftar sekarang, gratis — dan dapatkan akses ke program loyalitas eksklusif</p>
            <div className="lp-cta-btns">
              <motion.button className="lp-btn-hero" style={{ fontSize: 16, padding: '16px 40px' }} onClick={() => navigate('/register')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                🍵 Mulai Sekarang — Gratis!
              </motion.button>
              <button className="lp-btn-hero-outline" style={{ fontSize: 14 }} onClick={() => navigate('/login')}>
                Sudah punya akun? Masuk
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <img src="/logo.jpg" alt="OkiruDrink" className="lp-footer-logo" />
            <div>
              <p className="lp-footer-name">OkiruDrink</p>
              <p className="lp-footer-tagline">Healthy but Tasty 🌿</p>
            </div>
          </div>
          <div className="lp-footer-links">
            <p className="lp-footer-link" onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}>Produk</p>
            <p className="lp-footer-link" onClick={() => document.querySelector('#ingredients')?.scrollIntoView({ behavior: 'smooth' })}>Bahan</p>
            <p className="lp-footer-link" onClick={() => document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })}>Tentang</p>
            <p className="lp-footer-link" onClick={() => navigate('/login')}>Login</p>
          </div>
          <p className="lp-footer-copy">© 2026 OkiruDrink — Muara Enim, Sumatera Selatan</p>
        </div>
      </footer>
    </div>
  )
}
