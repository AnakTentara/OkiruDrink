import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Header       from '../components/layout/Header'
import BottomNav    from '../components/layout/BottomNav'
import CartButton   from '../components/shared/CartButton'
import ProductModal from '../components/shared/ProductModal'
import Skeleton     from '../components/shared/Skeleton'
import './MenuPage.css'

const categories = [
  { key: 'all',        label: 'Semua' },
  { key: 'teh-jintan', label: 'Teh Jintan' },
  { key: 'teh-herbal', label: 'Teh Herbal' },
  { key: 'bundle',     label: 'Bundle' },
]

const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`

const fetchProducts = async () => {
  const res = await fetch('http://localhost:2027/api/products')
  const json = await res.json()
  if (!json.ok) throw new Error('Gagal mengambil data produk')
  return json.products
}

export default function MenuPage() {
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  const filtered = products.filter(p => {
    const matchCat = activeCat === 'all' || p.category === activeCat
    const matchQ   = p.name.toLowerCase().includes(search.toLowerCase()) ||
                     (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchQ
  })

  return (
    <>
      <Header />
      <main className="page-content">

        {/* Search Bar */}
        <div className="menu-search-wrap">
          <div className="input-wrapper">
            <Search size={16} className="input-icon" />
            <input
              id="menu-search"
              className="input-field"
              type="text"
              placeholder="Cari minuman..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="cat-tabs-scroll">
          {categories.map(c => (
            <button
              key={c.key}
              id={`cat-${c.key}`}
              className={`cat-tab ${activeCat === c.key ? 'active' : ''}`}
              onClick={() => setActiveCat(c.key)}
            >
              {activeCat === c.key && (
                <motion.div
                  layoutId="cat-indicator"
                  className="cat-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="menu-grid px-16">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="product-card" style={{ padding: 12 }}>
                <Skeleton height="140px" borderRadius="12px" />
                <div style={{ marginTop: 12 }}>
                  <Skeleton height="16px" width="80%" style={{ marginBottom: 8 }} />
                  <Skeleton height="12px" width="60%" style={{ marginBottom: 16 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton height="16px" width="40%" />
                    <Skeleton height="32px" width="32px" borderRadius="50%" />
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="menu-empty">
              <span style={{ fontSize: 40 }}>⚠️</span>
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Gagal memuat produk.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  className="menu-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span style={{ fontSize: 40 }}>🌿</span>
                  <p style={{ color: 'var(--neutral-400)', fontWeight: 600 }}>Produk tidak ditemukan</p>
                </motion.div>
              ) : (
                filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className="product-card"
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ delay: i * 0.05, duration: 0.28 }}
                    onClick={() => setSelected(p)}
                    whileTap={{ scale: 0.96 }}
                  >
                    <div className="product-img-wrap">
                      <img src={p.image} alt={p.name} className="product-img" />
                      {p.badge && (
                        <span className={`badge product-badge ${
                          p.badge === 'TERLARIS' ? 'badge-green' :
                          p.badge === 'BARU'     ? 'badge-gold'  :
                          p.badge === 'PROMO'    ? 'badge-red'   : 'badge-dark'
                        }`}>{p.badge}</span>
                      )}
                    </div>
                    <div className="product-info">
                      <p className="product-name">{p.name}</p>
                      <p className="product-desc">{p.description}</p>
                      <div className="product-footer">
                        <span className="product-price">{formatRp(p.price)}</span>
                        <button
                          className="product-add-btn"
                          onClick={e => { e.stopPropagation(); setSelected(p) }}
                          aria-label={`Tambah ${p.name}`}
                        >+</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>

        <div style={{ height: 24 }} />
      </main>
      <AnimatePresence>
        {selected && <ProductModal key="product-modal" product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      <CartButton />
      <BottomNav />
    </>
  )
}
