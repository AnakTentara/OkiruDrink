import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Package, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import './SubPages.css'

const formatRp = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`

export default function OrderHistoryPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const orders = user?.orders || []

  return (
    <div className="sub-page">
      <div className="sub-header">
        <button className="sub-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 className="sub-title">Riwayat Pesanan</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="sub-content">
        {orders.length === 0 ? (
          <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span style={{ fontSize: 56 }}>📦</span>
            <h3>Belum ada pesanan</h3>
            <p>Pesanan yang sudah kamu buat akan muncul di sini</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Pesan Sekarang
            </button>
          </motion.div>
        ) : (
          <div className="order-list">
            {orders.map((order, i) => (
              <motion.div
                key={i}
                className="order-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="oc-header">
                  <div className="oc-id">
                    <Package size={14} />
                    <span>#OKR{new Date(order.date).getTime().toString().slice(-6)}</span>
                  </div>
                  <span className="oc-status">Selesai ✓</span>
                </div>
                <div className="oc-body">
                  <div>
                    <p className="oc-items">{order.items?.length || 0} item</p>
                    <p className="oc-date">
                      <Clock size={11} />
                      {new Date(order.date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="oc-total">{formatRp(order.total)}</span>
                </div>
                {order.items && (
                  <div className="oc-product-list">
                    {order.items.slice(0, 3).map((item, j) => (
                      <div key={j} className="oc-product-item">
                        <img src={item.image} alt={item.name} className="oc-product-img" />
                        <div className="oc-product-info">
                          <span className="oc-product-name">{item.name}</span>
                          <span className="oc-product-qty">x{item.qty}</span>
                        </div>
                        <span className="oc-product-price">{formatRp(item.price * item.qty)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="oc-more">+{order.items.length - 3} item lainnya</p>
                    )}
                  </div>
                )}
                <button className="oc-reorder btn btn-outline btn-sm">Pesan Lagi</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
