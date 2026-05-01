import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf, Heart, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SubPages.css'

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
        <motion.div
          className="about-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src="/logo.jpg" alt="OkiruDrink" className="about-logo" />
          <span className="about-brand">OkiruDrink</span>
          <span className="about-version">Versi 1.0.0 (Prototype)</span>
        </motion.div>

        {/* About */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3>🍃 Apa itu OkiruDrink?</h3>
          <p>
            OkiruDrink adalah minuman teh herbal inovatif yang dibuat dari ekstrak <strong>Daun Plectranthus amboinicus</strong> (Torbangun) 
            pilihan, dipadukan dengan pemanis alami <strong>Stevia</strong>. Dibuat dengan resep tradisional yang dimodernisasi 
            untuk menghasilkan minuman yang sehat, segar, dan nikmat.
          </p>
        </motion.div>

        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3>🫀 Manfaat Kesehatan</h3>
          <p>
            Daun Torbangun dikenal kaya akan antioksidan, baik untuk pencernaan, meningkatkan daya tahan tubuh, 
            serta mengandung senyawa anti-inflamasi alami. Dengan pemanis Stevia, OkiruDrink aman untuk dikonsumsi 
            tanpa khawatir gula berlebih.
          </p>
        </motion.div>

        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3>🏭 Asal Produk</h3>
          <p>
            Diproduksi langsung di <strong>Muara Enim, Sumatera Selatan</strong>. Semua bahan baku diperoleh dari 
            petani lokal yang membudidayakan tanaman Torbangun secara organik. OkiruDrink berkomitmen mendukung 
            perekonomian lokal dan pertanian berkelanjutan.
          </p>
        </motion.div>

        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3>📋 Informasi Produk</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {[
              ['Isi', '200ml / Botol'],
              ['Sertifikasi', 'BPOM Terdaftar'],
              ['Halal', 'Halal & Aman ✓'],
              ['Penyimpanan', 'Simpan di suhu 5-10°C'],
              ['Masa Berlaku', '6 bulan sejak produksi'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--neutral-100)' }}>
                <span style={{ fontSize: 13, color: 'var(--neutral-500)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div className="about-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3>📞 Kontak</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={16} color="var(--primary-dark)" />
              <span style={{ fontSize: 13, color: 'var(--neutral-600)' }}>Muara Enim, Sumatera Selatan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Phone size={16} color="var(--primary-dark)" />
              <span style={{ fontSize: 13, color: 'var(--neutral-600)' }}>+62 812-3456-7890</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Mail size={16} color="var(--primary-dark)" />
              <span style={{ fontSize: 13, color: 'var(--neutral-600)' }}>hello@okirudrink.id</span>
            </div>
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
