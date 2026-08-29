import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, CheckCircle2, LogOut, UtensilsCrossed } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const statusFlow = ['pending', 'preparing', 'ready', 'delivered'];
const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-secondary-container text-on-secondary-container' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-primary-container text-on-primary-container' },
  ready: { label: 'Ready', icon: CheckCircle2, color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
};

const KitchenView = () => {
  const { authChecked, isKitchenAuthenticated, logout, orders, updateOrderStatus } = useAdmin();

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-secondary/50">Loading...</p>
      </div>
    );
  }

  if (!isKitchenAuthenticated) {
    return <Navigate to="/kitchen/login" replace />;
  }

  const activeOrders = orders
    .filter((o) => o.status !== 'delivered')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const nextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return statusFlow[idx + 1] || null;
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex items-center justify-between p-6 bg-white border-b border-primary/5 sticky top-0 z-10">
        <h1 className="font-headline-md text-2xl text-primary flex items-center gap-2">
          <ChefHat size={24} /> Kitchen Orders
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-bold"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {activeOrders.length === 0 ? (
          <div className="bg-white p-16 rounded-[24px] text-center border border-primary/5">
            <ChefHat className="mx-auto mb-4 text-secondary/30" size={40} />
            <p className="text-secondary/50 text-lg">No active orders right now.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {activeOrders.map((order) => {
                const config = statusConfig[order.status];
                const next = nextStatus(order.status);
                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[24px] p-6 shadow-sm border border-primary/5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="text-primary" size={20} />
                        <span className="font-headline-md text-2xl text-primary">Table {order.table || '—'}</span>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${config.color}`}>
                        <config.icon size={12} /> {config.label}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-base">
                          <span className="text-secondary font-medium">{item.qty} × {item.name}</span>
                        </div>
                      ))}
                    </div>

                    {next && (
                      <button
                        onClick={() => updateOrderStatus(order._id, next)}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:shadow-lg active:scale-[0.98] transition-all"
                      >
                        Mark {statusConfig[next]?.label || 'Delivered'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenView;