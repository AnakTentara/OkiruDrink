import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Leaf, ChevronLeft, Check, MessageSquare } from 'lucide-react'
import { useCartStore as useCart } from '../../store/useCartStore'
import './ProductModal.css'

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [qty,        setQty]        = useState(1)
  const [sweetLevel, setSweetLevel] = useState(product.sweetLevels[0])
  const [iceLevel,   setIceLevel]   = useState(product.iceLevels[0])
  const [notes,      setNotes]      = useState('')
  const [added,      setAdded]      = useState(false)
  const contentRef = useRef(null)
  const [imgScale, setImgScale] = useState(1)

  // Parallax effect on scroll
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handleScroll = () => {
      const st = el.scrollTop
      const scale = Math.max(1 - st * 0.0008, 0.85)
      setImgScale(scale)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAdd = () => {
    addItem(product, qty, sweetLevel, iceLevel)
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 1100)
  }

  return (
    <motion.div
      className="full-page-modal"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
    >
      {/* Header Bar */}
      <div className="fp-header">
        <button className="fp-back-btn" onClick={onClose} aria-label="Kembali">
          <ChevronLeft size={24} />
        </button>
        <h2 className="fp-header-title">Detail Produk</h2>
        <div style={{ width: 40 }} /> {/* Spacer for balance */}
      </div>

      {/* Scrollable Content */}
      <div className="fp-content" ref={contentRef}>
        {/* Product Image */}
        <div className="modal-img-wrap">
          <motion.img
            src={product.image}
            alt={product.name}
            className="modal-img"
            style={{ transform: `scale(${imgScale})` }}
          />
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
          <div className="divider-line" />

          {/* Sweet Level */}
          <div className="option-group">
            <p className="option-label">Tingkat Kemanisan</p>
            <div className="option-chips">
              {product.sweetLevels.map(lv => (
                <motion.button
                  key={lv}
                  className={`option-chip ${sweetLevel === lv ? 'active' : ''}`}
                  onClick={() => setSweetLevel(lv)}
                  whileTap={{ scale: 0.95 }}
                >{lv}</motion.button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div className="option-group">
            <p className="option-label">Level Es</p>
            <div className="option-chips">
              {product.iceLevels.map(lv => (
                <motion.button
                  key={lv}
                  className={`option-chip ${iceLevel === lv ? 'active' : ''}`}
                  onClick={() => setIceLevel(lv)}
                  whileTap={{ scale: 0.95 }}
                >{lv}</motion.button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="option-group">
            <p className="option-label">
              <MessageSquare size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Catatan Tambahan
            </p>
            <textarea
              className="modal-notes"
              placeholder="Contoh: Kurangi gula, tambah es batu..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={120}
              rows={2}
            />
            <span className="notes-counter">{notes.length}/120</span>
          </div>
          
          {/* Extra space at bottom of content so it doesn't get hidden behind footer */}
          <div style={{ height: 40 }} />
        </div>
      </div>

      {/* Fixed Bottom Footer (Shopee / Grab style) */}
      <div className="fp-footer">
        <div className="qty-control">
          <motion.button
            className="qty-btn"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            aria-label="Kurang"
            whileTap={{ scale: 0.85 }}
          >
            <Minus size={16} />
          </motion.button>
          <motion.span
            className="qty-val"
            key={qty}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >{qty}</motion.span>
          <motion.button
            className="qty-btn"
            onClick={() => setQty(q => q + 1)}
            aria-label="Tambah"
            whileTap={{ scale: 0.85 }}
          >
            <Plus size={16} />
          </motion.button>
        </div>

        <motion.button
          className={`btn btn-primary flex-1 add-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-8 justify-center"
              >
                <motion.span
                  className="added-check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <Check size={20} strokeWidth={3} />
                </motion.span>
                Ditambahkan!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-8 justify-center"
              >
                <ShoppingBag size={18} />
                Tambah — {formatRp(product.price * qty)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}
