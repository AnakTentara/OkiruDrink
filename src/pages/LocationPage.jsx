import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Navigation, Check, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SubPages.css'

const locations = [
  { id: 1, name: 'OkiruDrink Muara Enim', addr: 'Jl. Merdeka No. 45, Kel. Pasar Muara Enim', dist: '0.5 km', open: true },
  { id: 2, name: 'OkiruDrink Lahat', addr: 'Jl. Jendral Sudirman No. 12, Kota Lahat', dist: '45 km', open: true },
  { id: 3, name: 'OkiruDrink Palembang', addr: 'Jl. Soekarno-Hatta, Palembang', dist: '210 km', open: false },
  { id: 4, name: 'OkiruDrink Prabumulih', addr: 'Jl. Sudirman No. 8, Prabumulih', dist: '78 km', open: true },
]

export default function LocationPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(1)
  const [search, setSearch] = useState('')

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.addr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Pilih Lokasi</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Map */}
        <div className="address-map-placeholder" style={{ height: 200, marginBottom: 16 }}>
          <iframe
            title="Outlet Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=104.5%2C-4.0%2C105.0%2C-3.5&layer=mapnik&marker=-3.75%2C104.75"
            loading="lazy"
          />
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1.5px solid var(--neutral-200)',
          borderRadius: 'var(--radius-full)', padding: '4px 14px', marginBottom: 16
        }}>
          <Search size={16} color="var(--neutral-400)" />
          <input
            type="text"
            placeholder="Cari outlet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'none',
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
              color: 'var(--neutral-900)', padding: '10px 0'
            }}
          />
        </div>

        {/* Current Location */}
        <div className="location-current">
          <div className="lc-icon">
            <Navigation size={18} color="#fff" />
          </div>
          <div>
            <p className="lc-title">Lokasi Saat Ini</p>
            <p className="lc-sub">Muara Enim, Sumatera Selatan</p>
          </div>
        </div>

        {/* Outlet List */}
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--neutral-700)' }}>
          Outlet Terdekat ({filtered.length})
        </h3>

        {filtered.map((loc, i) => (
          <motion.div
            key={loc.id}
            className={`location-item ${selected === loc.id ? 'active' : ''}`}
            onClick={() => setSelected(loc.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="li-icon" style={{
              background: selected === loc.id ? 'var(--primary)' : 'var(--neutral-100)',
            }}>
              <MapPin size={16} color={selected === loc.id ? '#fff' : 'var(--neutral-500)'} />
            </div>
            <div className="li-info">
              <p className="li-name">{loc.name}</p>
              <p className="li-addr">{loc.addr}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{loc.dist}</p>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: loc.open ? 'var(--primary-dark)' : 'var(--danger)',
              }}>
                {loc.open ? '● Buka' : '● Tutup'}
              </span>
            </div>
          </motion.div>
        ))}

        <motion.button
          className="btn btn-primary btn-full btn-lg"
          style={{ marginTop: 16 }}
          whileTap={{ scale: 0.97 }}
        >
          <Check size={16} style={{ marginRight: 8 }} /> Pilih Lokasi Ini
        </motion.button>
      </div>
    </div>
  )
}
