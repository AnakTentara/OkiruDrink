import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => {
    localStorage.removeItem('okiru_token')
    set({ user: null })
  },
  addOrder: (order) => set((state) => {
    if (!state.user) return state
    const newOrder = { ...order, date: new Date().toISOString() }
    return { user: { ...state.user, orders: [newOrder, ...(state.user.orders || [])] } }
  }),
  addPoints: (pts) => set((state) => {
    if (!state.user) return state
    const newPoints = (state.user.points || 0) + pts
    const newQualifying = (state.user.qualifyingPoints || 0) + pts
    let newLevel = state.user.level || 'Basic'
    
    // Evaluate new level (Silver at 500, Gold at 2000, Diamond at 5000)
    if (newPoints >= 5000) newLevel = 'Diamond'
    else if (newPoints >= 2000) newLevel = 'Gold'
    else if (newPoints >= 500) newLevel = 'Silver'

    return { user: { ...state.user, points: newPoints, qualifyingPoints: newQualifying, level: newLevel } }
  }),
  useVoucher: () => {},
  verifyOTP: () => {},
  addStamp: () => {}
}))

export const ALL_LEVELS = [
  { 
    key: 'Basic', label: 'Okiru Member', color: '#8B8B8B', 
    gradient: 'linear-gradient(135deg, #9E9E9E, #757575)', icon: '🌱', 
    minPoints: 0, nextLevel: 'Silver', nextMin: 500, 
    perks: [
      '✅ Akses ke seluruh menu OkiruDrink',
      '✅ Kumpul poin setiap pembelian (1 poin = Rp 1.000)',
      '✅ Voucher selamat datang: Diskon 5% (maks. Rp 5.000)',
      '✅ Notifikasi promo & menu baru',
      '✅ Sistem Stamp: Beli 3 dapat 1 GRATIS',
    ]
  },
  { 
    key: 'Silver', label: 'Silver Member', color: '#78909C', 
    gradient: 'linear-gradient(135deg, #B0BEC5, #78909C)', icon: '🥈', 
    minPoints: 500, nextLevel: 'Gold', nextMin: 2000, 
    perks: [
      '✅ Semua keuntungan Okiru Member',
      '⭐ Diskon 5% otomatis untuk 2 pembelian',
      '⭐ Voucher ulang tahun: 1 cup GRATIS',
      '⭐ Akses early preview menu baru (3 hari lebih awal)',
      '⭐ Prioritas antrian di outlet (skip waiting list)',
      '⭐ Bonus poin 1.2x lipat hari Sabtu & Minggu',
    ]
  },
  { 
    key: 'Gold', label: 'Gold Member', color: '#D4A017', 
    gradient: 'linear-gradient(135deg, #F9A825, #F57F17)', icon: '🥇', 
    minPoints: 2000, nextLevel: 'Diamond', nextMin: 5000, 
    perks: [
      '✅ Semua keuntungan Silver Member',
      '🌟 Diskon 10% otomatis untuk 3 pembelian',
      '🌟 Gratis ongkir delivery (tanpa minimum)',
      '🌟 Bonus poin 1.5x lipat setiap pembelian',
      '🌟 Custom cup nama sendiri tanpa biaya tambahan',
      '🌟 Undangan event & launching produk eksklusif',
    ]
  },
  { 
    key: 'Diamond', label: 'Diamond Member', color: '#00BCD4', 
    gradient: 'linear-gradient(135deg, #26C6DA, #00838F)', icon: '💎', 
    minPoints: 5000, nextLevel: null, nextMin: null, 
    perks: [
      '✅ Semua keuntungan Gold Member',
      '💎 Diskon 15% otomatis untuk 5 pembelian',
      '💎 1 minuman GRATIS per bulan (pilih bebas)',
      '💎 Akses menu seasonal & rahasia eksklusif',
      '💎 Bonus poin 2x lipat setiap pembelian',
      '💎 Line customer support prioritas (CS khusus)',
      '💎 Kesempatan Ikutan Giveaway Merchandise & tumbler eksklusif bulanan',
    ]
  },
]

export function getLevelInfo(level) {
  return ALL_LEVELS.find(l => l.key === level) || ALL_LEVELS[0]
}

