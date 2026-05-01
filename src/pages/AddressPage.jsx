import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Plus, Navigation, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SubPages.css'

const savedAddresses = [
  {
    id: 1,
    label: 'Rumah',
    name: 'Budi Utama',
    detail: 'Jl. Merdeka No. 45, RT 03/RW 02, Kel. Pasar Muara Enim, Kec. Muara Enim, Kab. Muara Enim, Sumatera Selatan 31312',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Kantor',
    name: 'Budi Utama',
    detail: 'Jl. Jendral Sudirman No. 12, Muara Enim, Sumatera Selatan 31311',
    isDefault: false,
  },
]

export default function AddressPage() {
  const navigate = useNavigate()
  const [addresses] = useState(savedAddresses)

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Alamat Pengiriman</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {/* Embedded Map */}
        <div className="address-map-placeholder">
          <iframe
            title="OkiruDrink Location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=104.7%2C-3.8%2C104.8%2C-3.7&layer=mapnik&marker=-3.75%2C104.75"
            loading="lazy"
          />
        </div>

        {/* Saved Addresses */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Alamat Tersimpan</h3>
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              className="address-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="ac-header">
                <span className="ac-label">{addr.label}</span>
                {addr.isDefault && <span className="ac-default">Utama</span>}
              </div>
              <p className="ac-name">{addr.name}</p>
              <p className="ac-detail">{addr.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Add Address Button */}
        <motion.button
          className="btn btn-outline btn-full"
          style={{ gap: 8 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Tambah Alamat Baru
        </motion.button>

        <motion.button
          className="btn btn-primary btn-full"
          style={{ gap: 8, marginTop: 10 }}
          whileTap={{ scale: 0.97 }}
        >
          <Navigation size={16} /> Gunakan Lokasi Saat Ini
        </motion.button>
      </div>
    </div>
  )
}
