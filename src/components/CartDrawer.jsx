import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const CartDrawer = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, totalPrice, isCartOpen, setIsCartOpen, tableId } = useCart();
  const { addOrder } = useAdmin();
  const [orderPlaced, setOrderPlaced] = useState(null); // null | order id
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCartOpen]);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderError('');
    try {
      const id = await addOrder({
        table: tableId,
        items: cartItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        total: totalPrice
      });
      setOrderPlaced(id);
      clearCart();
      setTimeout(() => {
        setOrderPlaced(null);
        setIsCartOpen(false);
      }, 3500);
    } catch (err) {
      setOrderError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[90]"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface z-[100] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-primary/10">
              <div>
                <h2 className="font-headline-md text-2xl text-primary flex items-center gap-2">
                  <ShoppingBag size={22} /> Your Order
                </h2>
                {tableId && (
                  <p className="text-xs font-bold text-secondary/60 flex items-center gap-1 mt-1">
                    <UtensilsCrossed size={12} /> Table {tableId}
                  </p>
                )}
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-secondary hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>

            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="text-on-tertiary-fixed" size={32} />
                </motion.div>
                <h3 className="font-headline-md text-2xl text-primary mb-2">Order Sent to Kitchen!</h3>
                <p className="text-secondary text-sm">
                  {tableId ? `Your order for Table ${tableId} is being prepared.` : 'Your order is being prepared.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-secondary/60">
                      <ShoppingBag size={40} className="mb-4 opacity-30" />
                      <p>Your cart is empty.</p>
                      <p className="text-sm mt-1">Add something delicious from the menu.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.name}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between gap-4"
                        >
                          <div>
                            <h4 className="font-bold text-primary">{item.name}</h4>
                            <p className="text-secondary/60 text-sm">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-3 bg-white p-1 rounded-full border border-primary/10">
                            <button
                              onClick={() => removeFromCart(item.name)}
                              className="p-1 hover:text-primary transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="p-1 bg-primary text-white rounded-full hover:scale-110 transition-transform"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-primary/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary font-bold">Total</span>
                      <span className="font-headline-md text-2xl text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                    {tableId ? (
                      <>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={placingOrder}
                          className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-wait"
                        >
                          {placingOrder ? 'Placing Order...' : `Place Order — Table ${tableId}`}
                        </button>
                        {orderError && (
                          <p className="text-xs font-bold text-error text-center">{orderError}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          disabled
                          className="w-full bg-primary/30 text-white py-4 rounded-2xl font-bold cursor-not-allowed"
                        >
                          Place Order
                        </button>
                        <p className="text-xs text-secondary/50 text-center">Scan your table's QR code to place a dine-in order.</p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;