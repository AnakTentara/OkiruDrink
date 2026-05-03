import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore as useCart } from '../../store/useCartStore'
import './CartButton.css'

export default function CartButton() {
  const { items, getCartCount, getCartTotal } = useCart()
  const cart = {
    items,
    totalItems: getCartCount(),
    totalPrice: getCartTotal()
  }
  const navigate  = useNavigate()

  if (cart.totalItems === 0) return null

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

  return (
    <AnimatePresence>
      <motion.button
        className="cart-fab"
        onClick={() => navigate('/cart')}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="cart-fab-left">
          <div className="cart-badge-wrap">
            <ShoppingBag size={20} color="#fff" />
            <motion.span
              key={cart.totalItems}
              className="cart-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              {cart.totalItems}
            </motion.span>
          </div>
          <span className="cart-label">Lihat Keranjang</span>
        </div>
        <span className="cart-total">{formatRp(cart.totalPrice)}</span>
      </motion.button>
    </AnimatePresence>
  )
}
