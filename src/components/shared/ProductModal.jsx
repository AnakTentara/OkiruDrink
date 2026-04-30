import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Leaf } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import './ProductModal.css'

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [qty,        setQty]        = useState(1)
  const [sweetLevel, setSweetLevel] = useState(product.sweetLevels[0])
  const [iceLevel,   setIceLevel]   = useState(product.iceLevels[0])
  const [added,      setAdded]      = useState(false)

  const handleAdd = () => {
    addItem(product, qty, sweetLevel, iceLevel)
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 900)
  }

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <motion.div
          className="bottom-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={(_, info) => { if (info.offset.y > 80) onClose() }}
        >
          <div className="sheet-handle" />

          {/* Product Image */}
          <div className="modal-img-wrap">
            <img src={product.image} alt={product.name} className="modal-img" />
            <button className="modal-close" onClick={onClose} aria-label="Tutup">
              <X size={18} />
            </button>
            {product.badge && (
              <span className={`badge modal-badge ${
                product.badge === 'TERLARIS' ? 'badge-green' :
                product.badge === 'BARU'     ? 'badge-gold'  :
                product.badge === 'PROMO'    ? 'badge-red'   : 'badge-dark'
              }`}>{product.badge}</span>
            )}
          </div>

          <div className="modal-body">
            <div className="modal-title-row">
              <h2 className="modal-name">{product.name}</h2>
              <span className="modal-price">{formatRp(product.price)}</span>
            </div>
            <p className="modal-desc">{product.description}</p>

            {/* Benefits */}
            <div className="modal-benefits">
              {product.benefits.map(b => (
                <span key={b} className="benefit-tag">
                  <Leaf size={11} /> {b}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--neutral-200)', margin: '14px 0' }} />

            {/* Sweet Level */}
            <div className="option-group">
              <p className="option-label">Tingkat Kemanisan</p>
              <div className="option-chips">
                {product.sweetLevels.map(lv => (
                  <button
                    key={lv}
                    className={`option-chip ${sweetLevel === lv ? 'active' : ''}`}
                    onClick={() => setSweetLevel(lv)}
                  >{lv}</button>
                ))}
              </div>
            </div>

            {/* Ice Level */}
            <div className="option-group">
              <p className="option-label">Level Es</p>
              <div className="option-chips">
                {product.iceLevels.map(lv => (
                  <button
                    key={lv}
                    className={`option-chip ${iceLevel === lv ? 'active' : ''}`}
                    onClick={() => setIceLevel(lv)}
                  >{lv}</button>
                ))}
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="modal-footer">
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Kurang"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-val">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Tambah"
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                className={`btn btn-primary flex-1 add-cart-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
              >
                {added ? (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex items-center gap-8"
                  >
                    ✓ Ditambahkan!
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-8">
                    <ShoppingBag size={16} />
                    Tambah — {formatRp(product.price * qty)}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
