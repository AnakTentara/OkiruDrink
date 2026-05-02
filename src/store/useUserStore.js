import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: () => {
    localStorage.removeItem('okiru_token')
    set({ user: null })
  }
}))

export const ALL_LEVELS = [
  { key: 'Basic',   label: 'Okiru Member',   color: '#8B8B8B', gradient: 'linear-gradient(135deg, #9E9E9E, #757575)', icon: '🌱', minPoints: 0,    nextLevel: 'Silver',  nextMin: 500,  perks: ['Akses menu standar', 'Poin setiap pembelian (1pt / Rp 1.000)', 'Voucher selamat datang'] },
  { key: 'Silver',  label: 'Silver Member',  color: '#A8A8A8', gradient: 'linear-gradient(135deg, #B0BEC5, #78909C)', icon: '🥈', minPoints: 500,  nextLevel: 'Gold',    nextMin: 2000, perks: ['Semua keuntungan Basic', 'Diskon 5% setiap pembelian', 'Voucher ulang tahun eksklusif', 'Akses early menu baru', 'Prioritas antrian outlet'] },
  { key: 'Gold',    label: 'Gold Member',    color: '#D4A017', gradient: 'linear-gradient(135deg, #F9A825, #F57F17)', icon: '🥇', minPoints: 2000, nextLevel: 'Diamond', nextMin: 5000, perks: ['Semua keuntungan Silver', 'Diskon 10% setiap pembelian', 'Gratis ongkir delivery', '1 minuman gratis / bulan', 'Undangan event eksklusif', 'Custom cup dengan nama'] },
  { key: 'Diamond', label: 'Diamond Member', color: '#00BCD4', gradient: 'linear-gradient(135deg, #26C6DA, #00838F)', icon: '💎', minPoints: 5000, nextLevel: null,      nextMin: null, perks: ['Semua keuntungan Gold', 'Diskon 15% setiap pembelian', '2 minuman gratis / bulan', 'Akses menu rahasia / seasonal', 'Gift box bulanan OkiruDrink', 'Prioritas customer support', 'Merchandise eksklusif tahunan'] },
]

export function getLevelInfo(level) {
  return ALL_LEVELS.find(l => l.key === level) || ALL_LEVELS[0]
}

