import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.id === action.payload.id &&
             i.sweetLevel === action.payload.sweetLevel &&
             i.iceLevel === action.payload.iceLevel
      )
      let newItems
      if (existing) {
        newItems = state.items.map(i =>
          i === existing ? { ...i, qty: i.qty + action.payload.qty } : i
        )
      } else {
        newItems = [...state.items, { ...action.payload }]
      }
      return recalc({ ...state, items: newItems })
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((_, idx) => idx !== action.payload)
      return recalc({ ...state, items: newItems })
    }
    case 'UPDATE_QTY': {
      const newItems = state.items.map((i, idx) =>
        idx === action.payload.idx ? { ...i, qty: action.payload.qty } : i
      ).filter(i => i.qty > 0)
      return recalc({ ...state, items: newItems })
    }
    case 'CLEAR':
      return { ...initialState, items: [] }
    default:
      return state
  }
}

function recalc(state) {
  const totalItems = state.items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  return { ...state, totalItems, totalPrice }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState, init => {
    try {
      const saved = localStorage.getItem('okiru_cart')
      if (saved) return recalc({ ...initialState, items: JSON.parse(saved) })
    } catch { /* ignore */ }
    return init
  })

  useEffect(() => {
    localStorage.setItem('okiru_cart', JSON.stringify(cart.items))
  }, [cart.items])

  const addItem = (product, qty = 1, sweetLevel = 'Normal', iceLevel = 'Es Normal') => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, qty, sweetLevel, iceLevel } })
  }
  const removeItem = (idx) => dispatch({ type: 'REMOVE_ITEM', payload: idx })
  const updateQty  = (idx, qty) => dispatch({ type: 'UPDATE_QTY', payload: { idx, qty } })
  const clearCart  = () => dispatch({ type: 'CLEAR' })

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
