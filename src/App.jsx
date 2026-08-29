import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Reservations from './pages/Reservations';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminReservations from './admin/AdminReservations';
import AdminMessages from './admin/AdminMessages';
import AdminMenu from './admin/AdminMenu';
import AdminOrders from './admin/AdminOrders';
import AdminQRCodes from './admin/AdminQRCodes';
import KitchenLogin from './admin/KitchenLogin';
import KitchenView from './admin/KitchenView';

import "./index.css";

const SiteLayout = ({ children }) => (
  <div className="min-h-screen bg-surface">
    <Navbar />
    <main>{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public site */}
            <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
            <Route path="/menu" element={<SiteLayout><Menu /></SiteLayout>} />
            <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
            <Route path="/gallery" element={<SiteLayout><Gallery /></SiteLayout>} />
            <Route path="/reservations" element={<SiteLayout><Reservations /></SiteLayout>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="qr-codes" element={<AdminQRCodes />} />
            </Route>

            {/* Kitchen */}
            <Route path="/kitchen/login" element={<KitchenLogin />} />
            <Route path="/kitchen" element={<KitchenView />} />
          </Routes>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;