import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import Seo from './components/Seo';
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
import AdminReviews from './admin/AdminReviews';
import AdminMenu from './admin/AdminMenu';
import AdminGallery from './admin/AdminGallery';
import AdminOrders from './admin/AdminOrders';
import AdminQRCodes from './admin/AdminQRCodes';
import AdminSettings from './admin/AdminSettings';
import AdminSEO from './admin/AdminSEO';
import KitchenLogin from './admin/KitchenLogin';
import KitchenView from './admin/KitchenView';

import "./index.css";

const SiteLayout = ({ page, children }) => (
  <div className="min-h-screen bg-surface">
    <Seo page={page} />
    <Navbar />
    <main>{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

function AppContent() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<SiteLayout page="home"><Home /></SiteLayout>} />
          <Route path="/menu" element={<SiteLayout page="menu"><Menu /></SiteLayout>} />
          <Route path="/about" element={<SiteLayout page="about"><About /></SiteLayout>} />
          <Route path="/gallery" element={<SiteLayout page="gallery"><Gallery /></SiteLayout>} />
          <Route path="/reservations" element={<SiteLayout page="reservations"><Reservations /></SiteLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<><Seo page="private" /><AdminLogin /></>} />
          <Route path="/admin" element={<><Seo page="private" /><AdminLayout /></>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="qr-codes" element={<AdminQRCodes />} />
            <Route path="seo" element={<AdminSEO />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Kitchen */}
          <Route path="/kitchen/login" element={<><Seo page="private" /><KitchenLogin /></>} />
          <Route path="/kitchen" element={<><Seo page="private" /><KitchenView /></>} />
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