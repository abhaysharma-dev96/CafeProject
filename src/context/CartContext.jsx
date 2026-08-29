import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({}); // { [name]: { name, price, qty } }
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableId, setTableId] = useState(null);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.name];
      return {
        ...prev,
        [item.name]: {
          name: item.name,
          price: item.price,
          qty: (existing?.qty || 0) + 1
        }
      };
    });
  };

  const removeFromCart = (name) => {
    setCart((prev) => {
      const existing = prev[name];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const clearCart = () => setCart({});

  const getQuantity = (name) => cart[name]?.qty || 0;

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, cartItems, addToCart, removeFromCart, clearCart, getQuantity,
      totalItems, totalPrice, isCartOpen, setIsCartOpen, tableId, setTableId
    }}>
      {children}
    </CartContext.Provider>
  );
};