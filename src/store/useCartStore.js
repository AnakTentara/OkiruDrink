import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product, qty, sweetLevel, iceLevel) => {
    set((state) => {
      const existing = state.items.find(i => 
        i.id === product.id && 
        i.sweetLevel === sweetLevel && 
        i.iceLevel === iceLevel
      )
      if (existing) {
        return {
          items: state.items.map(i => 
            i === existing ? { ...i, qty: i.qty + qty } : i
          )
        }
      }
      return { items: [...state.items, { ...product, qty, sweetLevel, iceLevel }] }
    })
  },
  updateQty: (index, delta) => {
    set((state) => {
      const newItems = [...state.items]
      const item = newItems[index]
      if (!item) return state
      item.qty += delta
      if (item.qty <= 0) {
        newItems.splice(index, 1)
      }
      return { items: newItems }
    })
  },
  clearCart: () => set({ items: [] }),
  removeItem: (index) => set((state) => {
    const newItems = [...state.items]
    newItems.splice(index, 1)
    return { items: newItems }
  }),
  getCartTotal: () => get().items.reduce((acc, item) => acc + item.price * item.qty, 0),
  getCartCount: () => get().items.reduce((acc, item) => acc + item.qty, 0)
}))
