import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Coffee, Clock, UtensilsCrossed, Armchair } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminDashboard = () => {
  const { reservations, messages, menuItems, orders, tables } = useAdmin();

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const unreadCount = messages.filter((m) => !m.read).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;

  const stats = [
    { label: 'Tables Occupied', value: `${occupiedCount} / ${tables.length}`, icon: Armchair },
    { label: 'Active Orders', value: activeOrdersCount, icon: UtensilsCrossed },
    { label: 'Pending Reservations', value: pendingCount, icon: Clock },
    { label: 'Unread Messages', value: unreadCount, icon: MessageSquare }
  ];

  return (
    <div>
      <h1 className="font-headline-md text-4xl text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-[24px] shadow-sm border border-primary/5"
          >
            <stat.icon className="text-primary mb-4" size={22} />
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-secondary/60 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5">
          <h2 className="font-headline-md text-xl text-primary mb-6">Active Orders</h2>
          {orders.filter((o) => o.status !== 'delivered').length === 0 ? (
            <p className="text-secondary/50 text-sm">No active orders. Table QR orders appear here.</p>
          ) : (
            <div className="space-y-4">
              {orders.filter((o) => o.status !== 'delivered').slice(0, 5).map((o) => (
                <div key={o._id} className="flex justify-between items-center text-sm border-b border-primary/5 pb-3 last:border-0">
                  <div>
                    <p className="font-bold text-primary">Table {o.table || '—'}</p>
                    <p className="text-secondary/60">{o.items.length} item{o.items.length !== 1 ? 's' : ''} — ${o.total.toFixed(2)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-primary-container text-on-primary-container">
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5">
          <h2 className="font-headline-md text-xl text-primary mb-6">Recent Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-secondary/50 text-sm">No reservations yet.</p>
          ) : (
            <div className="space-y-4">
              {reservations.slice(0, 5).map((r) => (
                <div key={r._id} className="flex justify-between items-center text-sm border-b border-primary/5 pb-3 last:border-0">
                  <div>
                    <p className="font-bold text-primary">{r.name}</p>
                    <p className="text-secondary/60">{r.date} at {r.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    r.status === 'confirmed' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                    r.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                    'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-primary/5 md:col-span-2">
          <h2 className="font-headline-md text-xl text-primary mb-6">Recent Messages</h2>
          {messages.length === 0 ? (
            <p className="text-secondary/50 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.slice(0, 5).map((m) => (
                <div key={m._id} className="flex justify-between items-center text-sm border-b border-primary/5 pb-3 last:border-0">
                  <div>
                    <p className="font-bold text-primary">{m.name}</p>
                    <p className="text-secondary/60 truncate max-w-[300px]">{m.message}</p>
                  </div>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;