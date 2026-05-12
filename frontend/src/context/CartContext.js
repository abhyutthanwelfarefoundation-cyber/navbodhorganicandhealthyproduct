import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        return { ...state, items: state.items.map(i => i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i._id === action.payload.id ? { ...i, quantity: action.payload.qty } : i) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try {
      const saved = localStorage.getItem('navbodh_cart');
      return saved ? { items: JSON.parse(saved) } : init;
    } catch { return init; }
  });

  useEffect(() => {
    localStorage.setItem('navbodh_cart', JSON.stringify(state.items));
  }, [state.items]);

  const total = state.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
