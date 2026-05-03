import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin, Truck, Tag, X, Check, ChevronRight, Clock, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore as useCart } from '../store/useCartStore'
import { useUserStore as useUser } from '../store/useUserStore'
import Header    from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import BottomSheet from '../components/shared/BottomSheet'
import './CartPage.css'

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, getCartCount, getCartTotal } = useCart()
  const cart = {
    items,
    totalItems: getCartCount(),
    totalPrice: getCartTotal()
  }
  const { user, addOrder, addPoints, useVoucher } = useUser()
  const navigate = useNavigate()
  const [deliveryMode, setDeliveryMode] = useState('pickup')
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [showVoucherSheet, setShowVoucherSheet] = useState(false)
  const [showTerms, setShowTerms] = useState(null) // voucher id whose terms are shown

  const vouchers = (user?.vouchers || []).filter(v => !v.used)

  // Calculate discount from selected voucher
  const discount = selectedVoucher
    ? selectedVoucher.discountType === 'percent'
      ? Math.floor(cart.totalPrice * selectedVoucher.discountValue / 100)
      : selectedVoucher.discountValue
    : 0
  const finalPrice = Math.max(cart.totalPrice - discount, 0)

  const handleSelectVoucher = (voucher) => {
    if (voucher.minPurchase && cart.totalPrice < voucher.minPurchase) return
    setSelectedVoucher(voucher)
    setShowVoucherSheet(false)
  }

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null)
  }

  const handleCheckout = () => {
    if (selectedVoucher) {
      useVoucher(selectedVoucher.id)
    }
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
                        <span className="ci-qty-val">{item.qty}</span>
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

            {/* Discount / Voucher Selector */}
            <div className="promo-section px-16">
              <motion.button
                className="voucher-selector-btn"
                onClick={() => setShowVoucherSheet(true)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="vs-left">
                  <Tag size={18} color="var(--primary-dark)" />
                  <div className="vs-info">
                    {selectedVoucher ? (
                      <>
                        <span className="vs-title">{selectedVoucher.title}</span>
                        <span className="vs-sub" style={{ color: 'var(--primary-dark)' }}>
                          Hemat {selectedVoucher.discountType === 'percent'
                            ? `${selectedVoucher.discountValue}%`
                            : formatRp(selectedVoucher.discountValue)
                          }
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="vs-title">Pakai Voucher</span>
                        <span className="vs-sub">{vouchers.length} voucher tersedia</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="vs-right">
                  {selectedVoucher && (
                    <motion.button
                      className="vs-remove"
                      onClick={(e) => { e.stopPropagation(); handleRemoveVoucher() }}
                      whileTap={{ scale: 0.85 }}
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                  <ChevronRight size={18} color="var(--neutral-400)" />
                </div>
              </motion.button>
            </div>

            {/* Summary */}
            <div className="cart-summary px-16">
              <div className="cs-row">
                <span>Subtotal ({cart.totalItems} item)</span>
                <span>{formatRp(cart.totalPrice)}</span>
              </div>
              {selectedVoucher && (
                <motion.div
                  className="cs-row cs-discount"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <span>Diskon ({selectedVoucher.code})</span>
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

      {/* Voucher Bottom Sheet */}
      <AnimatePresence>
        {showVoucherSheet && (
          <BottomSheet
            isOpen={showVoucherSheet}
            onClose={() => { setShowVoucherSheet(false); setShowTerms(null) }}
            title="Pilih Voucher"
          >
            {vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--neutral-400)' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🎫</span>
                <p style={{ fontWeight: 600 }}>Belum ada voucher tersedia</p>
              </div>
            ) : (
              <div className="bs-voucher-list">
                {vouchers.map(v => {
                  const isEligible = !v.minPurchase || cart.totalPrice >= v.minPurchase
                  const isSelected = selectedVoucher?.id === v.id
                  return (
                    <motion.div
                      key={v.id}
                      className={`bs-voucher-card ${isSelected ? 'bs-vc-selected' : ''} ${!isEligible ? 'bs-vc-disabled' : ''}`}
                      whileTap={isEligible ? { scale: 0.98 } : {}}
                      onClick={() => isEligible && handleSelectVoucher(v)}
                    >
                      <div className="bs-vc-header" style={{ borderLeftColor: v.color }}>
                        <div className="bs-vc-info">
                          <h4>{v.title}</h4>
                          <p className="bs-vc-desc">{v.desc}</p>
                          <div className="bs-vc-meta">
                            <span className="bs-vc-code">{v.code}</span>
                            <span className="bs-vc-expiry"><Clock size={10} /> s/d {v.expires}</span>
                          </div>
                        </div>
                        <div className="bs-vc-value">
                          <span className="bs-vc-amount">
                            {v.discountType === 'percent' ? `${v.discountValue}%` : formatRp(v.discountValue)}
                          </span>
                          {isSelected && <Check size={18} color="var(--primary-dark)" />}
                        </div>
                      </div>

                      {!isEligible && (
                        <p className="bs-vc-min">Min. belanja {formatRp(v.minPurchase)}</p>
                      )}

                      {/* Syarat & Ketentuan toggle */}
                      <button
                        className="bs-vc-terms-btn"
                        onClick={(e) => { e.stopPropagation(); setShowTerms(showTerms === v.id ? null : v.id) }}
                      >
                        <FileText size={12} />
                        Syarat & Ketentuan
                        <ChevronRight size={12} style={{ transform: showTerms === v.id ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                      </button>

                      <AnimatePresence>
                        {showTerms === v.id && (
                          <motion.div
                            className="bs-vc-terms"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p>{v.terms || 'Berlaku sesuai ketentuan yang berlaku.'}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </BottomSheet>
        )}
      </AnimatePresence>
    </>
  )
}
