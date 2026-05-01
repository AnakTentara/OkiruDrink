import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin, Truck, Tag, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import './CartPage.css'

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function CartPage() {
  const { cart, removeItem, updateQty, clearCart } = useCart()
  const { addOrder, addPoints } = useUser()
  const navigate = useNavigate()
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const [promoCode, setPromoCode]       = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError]     = useState('')

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'okiru2026') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Kode promo tidak valid')
      setPromoApplied(false)
    }
  }

  const discount = promoApplied ? Math.floor(cart.totalPrice * 0.1) : 0
  const finalPrice = cart.totalPrice - discount

  const handleCheckout = () => {
    const order = { items: cart.items, total: finalPrice }
    navigate('/order-success', { state: { order } })
  }

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Back button */}
        <div className="cart-topbar px-16">
          <motion.button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Keranjang</h2>
          {cart.totalItems > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>Hapus Semua</button>
          )}
        </div>

        {cart.items.length === 0 ? (
          <motion.div
            className="cart-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              style={{ fontSize: 56 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >🛒</motion.span>
            <h3>Keranjangmu kosong</h3>
            <p>Yuk tambahkan minuman favoritmu!</p>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/menu')}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={16} /> Lihat Menu
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Delivery Mode Selector */}
            <div className="delivery-selector px-16">
              <motion.button
                className={`delivery-opt ${deliveryMode === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryMode('pickup')}
                whileTap={{ scale: 0.97 }}
              >
                <MapPin size={18} />
                <div>
                  <span className="do-title">Ambil di Toko</span>
                  <span className="do-sub">Muara Enim</span>
                </div>
              </motion.button>
              <motion.button
                className={`delivery-opt ${deliveryMode === 'delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryMode('delivery')}
                whileTap={{ scale: 0.97 }}
              >
                <Truck size={18} />
                <div>
                  <span className="do-title">Diantar</span>
                  <span className="do-sub">± 30 menit</span>
                </div>
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="cart-items px-16">
              <AnimatePresence>
                {cart.items.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.sweetLevel}-${item.iceLevel}`}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-opts">{item.sweetLevel} · {item.iceLevel}</p>
                      <p className="cart-item-price">{formatRp(item.price)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <motion.button
                        className="ci-remove"
                        onClick={() => removeItem(idx)}
                        aria-label="Hapus"
                        whileTap={{ scale: 0.8 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                      <div className="ci-qty">
                        <motion.button
                          className="ci-qty-btn"
                          onClick={() => updateQty(idx, item.qty - 1)}
                          aria-label="Kurang"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Minus size={12} />
                        </motion.button>
                        <motion.span
                          className="ci-qty-val"
                          key={item.qty}
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >{item.qty}</motion.span>
                        <motion.button
                          className="ci-qty-btn"
                          onClick={() => updateQty(idx, item.qty + 1)}
                          aria-label="Tambah"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Plus size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Promo Code */}
            <div className="promo-section px-16">
              <div className="promo-input-row">
                <Tag size={16} className="promo-icon" />
                <input
                  className="promo-input"
                  type="text"
                  placeholder="Masukkan kode promo"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); setPromoApplied(false); }}
                />
                {promoApplied ? (
                  <span className="promo-applied"><Check size={14} /> Aktif</span>
                ) : (
                  <motion.button
                    className="promo-apply-btn"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    whileTap={{ scale: 0.95 }}
                  >Terapkan</motion.button>
                )}
              </div>
              {promoError && (
                <motion.p
                  className="promo-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >{promoError}</motion.p>
              )}
              {promoApplied && (
                <motion.p
                  className="promo-success"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >🎉 Diskon 10% berhasil diterapkan!</motion.p>
              )}
              <p className="promo-hint">Coba: <strong>OKIRU2026</strong></p>
            </div>

            {/* Summary */}
            <div className="cart-summary px-16">
              <div className="cs-row">
                <span>Subtotal ({cart.totalItems} item)</span>
                <span>{formatRp(cart.totalPrice)}</span>
              </div>
              {promoApplied && (
                <motion.div
                  className="cs-row cs-discount"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <span>Diskon Promo</span>
                  <span>-{formatRp(discount)}</span>
                </motion.div>
              )}
              <div className="cs-row">
                <span>Biaya Layanan</span>
                <span className="cs-free">Gratis</span>
              </div>
              <div className="cs-row">
                <span>{deliveryMode === 'delivery' ? 'Ongkos Kirim' : 'Pengambilan'}</span>
                <span className="cs-free">{deliveryMode === 'delivery' ? 'Rp 5.000' : 'Gratis'}</span>
              </div>
              <div className="cs-row cs-total">
                <span>Total</span>
                <span>{formatRp(finalPrice + (deliveryMode === 'delivery' ? 5000 : 0))}</span>
              </div>
            </div>

            <div className="px-16" style={{ marginTop: 16 }}>
              <motion.button
                id="btn-checkout"
                className="btn btn-primary btn-full btn-lg"
                onClick={handleCheckout}
                whileTap={{ scale: 0.97 }}
              >
                Pesan Sekarang — {formatRp(finalPrice + (deliveryMode === 'delivery' ? 5000 : 0))}
              </motion.button>
            </div>
          </>
        )}
        <div style={{ height: 24 }} />
      </main>
      <BottomNav />
    </>
  )
}
