import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
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

  const handleCheckout = () => {
    const order = { items: cart.items, total: cart.totalPrice }
    navigate('/order-success', { state: { order } })
  }

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Back button */}
        <div className="cart-topbar px-16">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
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
            <span style={{ fontSize: 56 }}>🛒</span>
            <h3>Keranjangmu kosong</h3>
            <p>Yuk tambahkan minuman favoritmu!</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              <ShoppingBag size={16} /> Lihat Menu
            </button>
          </motion.div>
        ) : (
          <>
            <div className="cart-items px-16">
              <AnimatePresence>
                {cart.items.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.sweetLevel}-${item.iceLevel}`}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-opts">{item.sweetLevel} · {item.iceLevel}</p>
                      <p className="cart-item-price">{formatRp(item.price)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className="ci-remove"
                        onClick={() => removeItem(idx)}
                        aria-label="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="ci-qty">
                        <button
                          className="ci-qty-btn"
                          onClick={() => updateQty(idx, item.qty - 1)}
                          aria-label="Kurang"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="ci-qty-val">{item.qty}</span>
                        <button
                          className="ci-qty-btn"
                          onClick={() => updateQty(idx, item.qty + 1)}
                          aria-label="Tambah"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="cart-summary px-16">
              <div className="cs-row">
                <span>Subtotal ({cart.totalItems} item)</span>
                <span>{formatRp(cart.totalPrice)}</span>
              </div>
              <div className="cs-row">
                <span>Biaya Layanan</span>
                <span className="cs-free">Gratis</span>
              </div>
              <div className="cs-row cs-total">
                <span>Total</span>
                <span>{formatRp(cart.totalPrice)}</span>
              </div>
            </div>

            <div className="px-16" style={{ marginTop: 16 }}>
              <motion.button
                id="btn-checkout"
                className="btn btn-primary btn-full btn-lg"
                onClick={handleCheckout}
                whileTap={{ scale: 0.97 }}
              >
                Pesan Sekarang — {formatRp(cart.totalPrice)}
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
