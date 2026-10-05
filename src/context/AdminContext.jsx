import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiCall } from '../api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

// Polling intervals (ms). Kam requests = 429 ka chance kam.
const KITCHEN_POLL_MS = 15000;
const ADMIN_POLL_MS = 30000;

export const AdminProvider = ({ children }) => {
  const [authRole, setAuthRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const isAdminAuthenticated = authRole === 'admin';
  const isKitchenAuthenticated = authRole === 'kitchen' || authRole === 'admin';

  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const getSettings = async () => {
    const data = await apiCall('/settings');
    return data;
  };

  const updateSettings = async (settings) => {
    const data = await apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    setSiteSettings(data);
    return data;
  };

  // SEO has its own endpoint so it never collides with the general Settings form
  const updateSeo = async (seo) => {
    const data = await apiCall('/settings/seo', {
      method: 'PUT',
      body: JSON.stringify({ seo })
    });
    setSiteSettings(data);
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    return apiCall('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  };

  useEffect(() => {
    getSettings().then(setSiteSettings).catch(() => {});
  }, []);

  // On first load, ask the backend "am I already logged in?" (httpOnly cookie based)
  useEffect(() => {
    apiCall('/auth/session')
      .then((data) => setAuthRole(data.authenticated ? data.role : null))
      .catch(() => setAuthRole(null))
      .finally(() => setAuthChecked(true));
  }, []);

  // Menu and tables are public — load them once on app start regardless of login
  useEffect(() => {
    refreshMenu();
    refreshTables();
    refreshGallery();
  }, []);

  // Reservations/messages/orders require login — load once we know the role
  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshReservations();
      refreshMessages();
      refreshReviews();
    }
    if (isKitchenAuthenticated) {
      refreshOrders();
    }
  }, [authRole]);

  // Live updates: poll while logged in, but only when the tab is visible
  // and at a gentler interval so we don't hit the backend rate limit.
  useEffect(() => {
    if (!isKitchenAuthenticated) return;
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      refreshOrders();
      refreshTables();
    };
    const interval = setInterval(tick, KITCHEN_POLL_MS);
    return () => clearInterval(interval);
  }, [authRole]);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      refreshReservations();
      refreshMessages();
      refreshReviews();
    };
    const interval = setInterval(tick, ADMIN_POLL_MS);
    return () => clearInterval(interval);
  }, [authRole]);

  const login = async (username, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuthRole(data.role);
    return data.role;
  };

  const logout = async () => {
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => {});
    setAuthRole(null);
    setReservations([]);
    setMessages([]);
    setReviews([]);
    setOrders([]);
  };

  // ---- Reservations ----
  const refreshReservations = async () => {
    try {
      const data = await apiCall('/reservations');
      setReservations((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch { /* silently ignore, likely not authed */ }
  };

  const addReservation = async (formData) => {
    const saved = await apiCall('/reservations', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return saved;
  };

  const updateReservationStatus = async (id, status) => {
    const updated = await apiCall(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
  };

  const deleteReservation = async (id) => {
    await apiCall(`/reservations/${id}`, { method: 'DELETE' });
    setReservations((prev) => prev.filter((r) => r._id !== id));
  };

  // ---- Messages ----
  const refreshMessages = async () => {
    try {
      const data = await apiCall('/messages');
      setMessages((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch { /* not authed yet */ }
  };

  const addMessage = async (formData) => {
    const saved = await apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return saved;
  };

  const markMessageRead = async (id) => {
    const updated = await apiCall(`/messages/${id}/read`, { method: 'PATCH' });
    setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const deleteMessage = async (id) => {
    await apiCall(`/messages/${id}`, { method: 'DELETE' });
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  // ---- Reviews ----
  const refreshReviews = async () => {
    try {
      const data = await apiCall('/reviews/all');
      setReviews((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch { /* not authed yet */ }
  };

  // Public: customer submits a review (stays pending until admin approves)
  const addReview = async (formData) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  const updateReviewStatus = async (id, status) => {
    const updated = await apiCall(`/reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setReviews((prev) => prev.map((r) => (r._id === id ? updated : r)));
  };

  const deleteReview = async (id) => {
    await apiCall(`/reviews/${id}`, { method: 'DELETE' });
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  // ---- Menu ----
  const refreshMenu = async () => {
    setMenuLoading(true);
    setMenuError('');
    try {
      const data = await apiCall('/menu');
      setMenuItems(data);
    } catch (err) {
      setMenuError(err.message || 'Could not load the menu. Please try again.');
    } finally {
      setMenuLoading(false);
    }
  };

  const addMenuItem = async (item) => {
    const saved = await apiCall('/menu', {
      method: 'POST',
      body: JSON.stringify(item)
    });
    setMenuItems((prev) => [...prev, saved]);
  };

  const updateMenuItem = async (id, updates) => {
    const updated = await apiCall(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    setMenuItems((prev) => prev.map((m) => (m._id === id ? updated : m)));
  };

  const deleteMenuItem = async (id) => {
    await apiCall(`/menu/${id}`, { method: 'DELETE' });
    setMenuItems((prev) => prev.filter((m) => m._id !== id));
  };

  // ---- Tables ----
  const refreshTables = async () => {
    try {
      const data = await apiCall('/tables');
      setTables((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch { /* ignore */ }
  };

  const addTable = async (label) => {
    try {
      const saved = await apiCall('/tables', {
        method: 'POST',
        body: JSON.stringify({ label })
      });
      setTables((prev) => [...prev, saved]);
      return true;
    } catch (err) {
      return false;
    }
  };

  const removeTable = async (id) => {
    await apiCall(`/tables/${id}`, { method: 'DELETE' });
    setTables((prev) => prev.filter((t) => t._id !== id));
  };

  // ---- Orders ----
  const refreshOrders = async () => {
    try {
      const data = await apiCall('/orders');
      setOrders((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch { /* not authed yet */ }
  };

  const addOrder = async (data) => {
    const saved = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return saved._id;
  };

  const updateOrderStatus = async (id, status) => {
    const updated = await apiCall(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  };

  const markOrderPaid = async (id) => {
    const updated = await apiCall(`/orders/${id}/paid`, { method: 'PATCH' });
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  };

  const deleteOrder = async (id) => {
    await apiCall(`/orders/${id}`, { method: 'DELETE' });
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  const getTableStatus = (tableLabel) => {
    const hasUnpaidOrder = orders.some((o) => o.table === tableLabel && !o.paid);
    return hasUnpaidOrder ? 'occupied' : 'available';
  };

  // ---- Gallery (saved in the database, visible to every visitor) ----
  const normalizeGallery = (item) => ({ id: item._id, title: item.title, category: item.category, image: item.image });

  const refreshGallery = async () => {
    try {
      const data = await apiCall('/gallery');
      setGalleryItems(Array.isArray(data) ? data.map(normalizeGallery) : []);
    } catch { /* keep whatever we have */ }
    finally { setGalleryLoading(false); }
  };

  const addGalleryItem = async (item) => {
    const saved = await apiCall('/gallery', { method: 'POST', body: JSON.stringify(item) });
    setGalleryItems((prev) => [...prev, normalizeGallery(saved)]);
  };

  const updateGalleryItem = async (id, updates) => {
    const saved = await apiCall(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    setGalleryItems((prev) => prev.map((item) => (item.id === id ? normalizeGallery(saved) : item)));
  };

  const deleteGalleryItem = async (id) => {
    await apiCall(`/gallery/${id}`, { method: 'DELETE' });
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ---- Custom QR images (saved on the table in the database) ----
  const customQrImages = useMemo(
    () => Object.fromEntries(tables.filter((t) => t.customQr).map((t) => [t._id, t.customQr])),
    [tables]
  );

  const saveCustomQrImage = async (tableId, image) => {
    const result = await apiCall(`/tables/${tableId}/qr-image`, { method: 'PUT', body: JSON.stringify({ image }) });
    setTables((prev) => prev.map((t) => (t._id === tableId ? { ...t, customQr: result.customQr } : t)));
  };

  const clearCustomQrImage = (tableId) => saveCustomQrImage(tableId, '');

  return (
    <AdminContext.Provider value={{
      authChecked, isAdminAuthenticated, isKitchenAuthenticated, login, logout,
      reservations, addReservation, updateReservationStatus, deleteReservation, refreshReservations,
      messages, addMessage, markMessageRead, deleteMessage, refreshMessages,
      reviews, addReview, updateReviewStatus, deleteReview, refreshReviews,
      menuItems, menuLoading, menuError, addMenuItem, updateMenuItem, deleteMenuItem, refreshMenu,
      getSettings, updateSettings, updateSeo, changePassword, siteSettings,
      tables, addTable, removeTable,
      orders, addOrder, updateOrderStatus, deleteOrder, markOrderPaid, getTableStatus, refreshOrders,
      galleryItems, galleryLoading, refreshGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      customQrImages, saveCustomQrImage, clearCustomQrImage
    }}>
      {children}
    </AdminContext.Provider>
  );
};