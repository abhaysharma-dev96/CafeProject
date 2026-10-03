import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

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
import AdminReviews from './admin/AdminReviews';
import AdminMenu from './admin/AdminMenu';
import AdminGallery from './admin/AdminGallery';
import AdminOrders from './admin/AdminOrders';
import AdminQRCodes from './admin/AdminQRCodes';
import AdminSettings from './admin/AdminSettings';
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

function AppContent() {
  const { siteSettings } = useAdmin();

  useEffect(() => {
    document.title = siteSettings?.websiteName || 'Brew & Hearth';
  }, [siteSettings]);

  return (
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
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="qr-codes" element={<AdminQRCodes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Kitchen */}
          <Route path="/kitchen/login" element={<KitchenLogin />} />
          <Route path="/kitchen" element={<KitchenView />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}

export default App;