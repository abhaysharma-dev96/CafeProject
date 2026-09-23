import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, Coffee, LogOut, Menu as MenuIcon, X, UtensilsCrossed, QrCode, ChefHat, Settings } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLayout = () => {
  const { authChecked, isAdminAuthenticated, logout, reservations, messages, orders } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-secondary/50">Loading...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const unreadCount = messages.filter((m) => !m.read).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/orders', label: 'Orders', icon: UtensilsCrossed, badge: activeOrdersCount },
    { to: '/admin/reservations', label: 'Reservations', icon: Calendar, badge: pendingCount },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { to: '/admin/menu', label: 'Menu', icon: Coffee },
    { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-primary/5 flex justify-between items-center">
        <div>
          <h1 className="font-headline-md text-xl text-primary">Brew & Hearth</h1>
          <p className="text-xs text-secondary/50 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-secondary">
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-surface'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <item.icon size={18} />
              {item.label}
            </span>
            {item.badge > 0 && (
              <span className="bg-error text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <Link
          to="/kitchen"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-secondary hover:bg-surface transition-all mt-2 border-t border-primary/5 pt-5"
        >
          <ChefHat size={18} /> Kitchen View
        </Link>
      </nav>

      <div className="p-4 border-t border-primary/5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-secondary hover:bg-error-container hover:text-on-error-container transition-all w-full"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-primary/5 sticky top-0 z-30">
        <h1 className="font-headline-md text-lg text-primary">Brew & Hearth Admin</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-primary">
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-primary/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-primary/5 flex-col fixed h-full">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar drawer */}
        <aside
          className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </aside>

        {/* Content */}
        <main className="flex-1 md:ml-64 p-5 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;