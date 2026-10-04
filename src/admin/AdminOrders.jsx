import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Clock, ChefHat, CheckCircle2, Trash2, X, Wallet } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/formatPrice';

const statusFlow = ['pending', 'preparing', 'ready', 'delivered'];
const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-secondary-container text-on-secondary-container' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-primary-container text-on-primary-container' },
  ready: { label: 'Ready', icon: CheckCircle2, color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-surface-container-high text-secondary' }
};

const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder, markOrderPaid } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableFilter = searchParams.get('table');

  const scopedOrders = tableFilter ? orders.filter((o) => o.table === tableFilter) : orders;
  const activeOrders = scopedOrders.filter((o) => o.status !== 'delivered');
  const pastOrders = scopedOrders.filter((o) => o.status === 'delivered');

  const clearFilter = () => setSearchParams({});

  const nextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return statusFlow[idx + 1] || null;
  };

  const OrderCard = ({ order }) => {
    const config = statusConfig[order.status];
    const next = nextStatus(order.status);
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-[24px] p-6 shadow-sm border border-primary/5"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-primary" size={18} />
            <span className="font-headline-md text-xl text-primary">Table {order.table || '—'}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${config.color}`}>
              <config.icon size={12} /> {config.label}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.paid ? 'text-tertiary-fixed-dim' : 'text-error'}`}>
              {order.paid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-secondary">{item.qty} × {item.name}</span>
              <span className="text-secondary/60">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-primary/5 pt-4">
          <span className="font-bold text-primary">{formatPrice(order.total)}</span>
          <div className="flex gap-2">
            {next && (
              <button
                onClick={() => updateOrderStatus(order._id, next)}
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all"
              >
                Mark {statusConfig[next].label}
              </button>
            )}
            {!order.paid && (
              <button
                onClick={() => {
                  if (window.confirm(`Mark Table ${order.table}'s order as paid .`)) {
                    markOrderPaid(order._id);
                  }
                }}
                className="flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all"
              >
                <Wallet size={12} /> Mark Paid
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Delete this order?')) deleteOrder(order._id);
              }}
              className="p-2 rounded-xl bg-surface text-secondary hover:bg-error-container hover:text-on-error-container transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-4xl text-primary">
          {tableFilter ? `Orders — Table ${tableFilter}` : 'Orders'}
        </h1>
        {tableFilter && (
          <button
            onClick={clearFilter}
            className="flex items-center gap-2 bg-surface text-secondary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all"
          >
            <X size={14} /> Clear filter
          </button>
        )}
      </div>

      <h2 className="text-sm font-bold uppercase tracking-widest text-secondary/50 mb-4">Active</h2>
      {activeOrders.length === 0 ? (
        <div className="bg-white p-10 rounded-[24px] text-center border border-primary/5 mb-10">
          <p className="text-secondary/50">
            {tableFilter
              ? `No active orders for Table ${tableFilter}.`
              : 'No active orders. Orders placed from table QR codes will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {activeOrders.map((order) => <OrderCard key={order._id} order={order} />)}
          </AnimatePresence>
        </div>
      )}

      {pastOrders.length > 0 && (
        <>
          <h2 className="text-sm font-bold uppercase tracking-widest text-secondary/50 mb-4">Delivered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            <AnimatePresence>
              {pastOrders.map((order) => <OrderCard key={order._id} order={order} />)}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;