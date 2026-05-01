import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductModal from '../shared/ProductModal'
import products from '../../data/products.json'
import './TodaySpecial.css'

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function TodaySpecial() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  // Show only first 4 on home
  const featured = products.slice(0, 4)

  return (
    <section className="today-special">
      <div className="section-header">
        <h3 className="section-title">Spesial Hari Ini</h3>
        <button className="section-link" onClick={() => navigate('/menu')}>
          Lihat Semua <ChevronRight size={14} />
        </button>
      </div>

      <div className="special-scroll">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            className="special-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            onClick={() => setSelected(p)}
            whileTap={{ scale: 0.96 }}
          >
            <div className="special-img-wrap">
              <img src={p.image} alt={p.name} className="special-img" />
              {p.badge && (
                <span className={`badge special-badge ${
                  p.badge === 'TERLARIS' ? 'badge-green' :
                  p.badge === 'BARU'     ? 'badge-gold'  :
                  p.badge === 'PROMO'    ? 'badge-red'   : 'badge-dark'
                }`}>{p.badge}</span>
              )}
            </div>
            <div className="special-info">
              <p className="special-name">{p.name}</p>
              <p className="special-price">{formatRp(p.price)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <ProductModal key="product-modal" product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
