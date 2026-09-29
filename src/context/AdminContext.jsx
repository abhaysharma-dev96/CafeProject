import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const defaultGalleryItems = [
  {
    id: 1,
    category: 'Interior',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI7oEHudfULsJoieesJs6XeeLdXOjBKdrfqHJZ9NHpmckWVjxeP4pIuYE6-HjFNdumSACCzbLyt9lubnkPR8Lmorj0eXZ2X2gDTmL6C1IbySanM7_mYBb1JLgb_mq-1qZERPIDbMX5R3Bxx1QSlVX_aj1KOKo9gCyWaxN2HqNmzoA83uV7O2JSrc-5qOOmPZXmZo2WgM1S8RMtQekUi15cS_bbExrq33D_isOj9t53UnPy13BnhZRj',
    title: 'Our Sun-Drenched Nook'
  },
  {
    id: 2,
    category: 'Food & Drink',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi7yrbwtJvlnuLaNg-qgm1RAf04gBe-JJADogqsy-QBbk-O4iNRTzrtSSLqSfrdlanwf6b4zU_H5d2AlD-K8B1Rwtx0NGftTFHz_CAoSRA5yr0ZP5rHEJMybYaFwNgftVRkz3lrysnn3oGzKI-8OnHzAQ2KYiCLK0XtYB3VDMwlEgC5qTS0xJ1a3A9S8uLYELeloMPzfBruzRLPjR7DNmkmnhm5N523zPgq75DohE8TN1Lkw0WzPgK',
    title: 'Morning Latte Ritual'
  },
  {
    id: 3,
    category: 'Interior',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nkanXUSbxTGjJ91tMEn2u0Kljb80wLuBTzuJu3fIgagdSDkha2jefhIuNvQJh9D-Xo5EnSMWbRRPh5mzJzfwXYyjOXiw_FsYzK-8UaiwfoZ2lY0qB3b6tbUdHu4LpcplOZraxgLEEiwTRL0SNVjaNlJH15nqBvfqdKVxRzZ9NS8HvroILyW5w6AbmUxkFKu97Z23hlZhwEO_ho0kOxI2y-RUhHo9k-Tl9JF8bTojIUVqYMDwwpNh',
    title: 'The Reading Lounge'
  },
  {
    id: 4,
    category: 'Events',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Ja8v01vdN6CD526WjvGeQRkHsI98EOZYqP89es0RzvVcRjGjMl2BgIrxMAXAA4FrbofV653TrLgdS2x4HNdfEiwmmMJLrBRgayW6MwL931iw6Zp1gedFCrHnGhUeAlAOMa8Mq_UyFZWWXM3OHHJOf3yIvKleqB0ybFF6bcECdIRDNsN4H9_vZ3xe65y-lOLiXKjH5HUC6PVAYZuQ6qzkuSbOrvkVLce7T3_u-MQmfCupJJOZjHnD',
    title: 'Evening Tasting Series'
  },
  {
    id: 5,
    category: 'Food & Drink',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqmA0zyIvaO-4_OkGanPN1tJ9sKBkxVWLt0cCIizpJX9sZPbHjF8CnXg7BiBR4qP-QXiQa_6V9fLu6hDhBz8wp9CsZ7LA9R5TzIQBobyF2sX5rvPEymUJW6SrFDyWLb_ONgZcm31F6A-mDHQTdHff03tmJn6a-GQVwxXgVn71esGIYk57CMgK3B2MuXigQIPLEeu6WVJAEB5XcG9359urSA5awnnNLY00dAFhNPJSdYMANY02jmU9V',
    title: 'Artisan Avocado Toast'
  },
  {
    id: 6,
    category: 'Interior',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM_giIUxjjyHqcnjcGDGpyAKMuZBlUK8NvbtOqNDI4kOZ4G9td-1MQdhhVK_nnoECrm7hVYB4aJzWWwivsbvsEgc-wDi5o7izZTmMqDnwHekrbKEblbSXa47L7I1emiDyeLnb0RrF-ZRCpftPCnh8IyFUu-hsJ92CB5ZhadfNY97kHfJZipxL0rEgmKTz1lGrbMSW8dmTJM_V7kRrNBad_teD5QtsnvnLZZvoGP-syc71Re3PGNKrI',
    title: 'The Hearth Station'
  }
];

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
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('brewhearth-gallery-items');
      return saved ? JSON.parse(saved) : defaultGalleryItems;
    } catch {
      return defaultGalleryItems;
    }
  });
  const [customQrImages, setCustomQrImages] = useState(() => {
    try {
      const saved = localStorage.getItem('brewhearth-custom-qr-images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('brewhearth-gallery-items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('brewhearth-custom-qr-images', JSON.stringify(customQrImages));
  }, [customQrImages]);

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
  }, []);

  // Reservations/messages/orders require login — load once we know the role
  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshReservations();
      refreshMessages();
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
    };
    const interval = setInterval(tick, ADMIN_POLL_MS);
    return () => clearInterval(interval);
  }, [authRole]);

  const login = async (username, password) => {
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      setAuthRole(data.role);
      return data.role;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    await apiCall('/auth/logout', { method: 'POST' }).catch(() => {});
    setAuthRole(null);
    setReservations([]);
    setMessages([]);
    setOrders([]);
  };

  // ---- Reservations ----
  const refreshReservations = async () => {
    try {
      const data = await apiCall('/reservations');
      setReservations((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch (err) { /* silently ignore, likely not authed */ }
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
    } catch (err) { /* not authed yet */ }
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
    } catch (err) { /* ignore */ }
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
    } catch (err) { /* not authed yet */ }
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

  const addGalleryItem = (item) => {
    setGalleryItems((prev) => [...prev, item]);
  };

  const updateGalleryItem = (id, updates) => {
    setGalleryItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteGalleryItem = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveCustomQrImage = (tableId, image) => {
    setCustomQrImages((prev) => ({ ...prev, [tableId]: image }));
  };

  const clearCustomQrImage = (tableId) => {
    setCustomQrImages((prev) => {
      const next = { ...prev };
      delete next[tableId];
      return next;
    });
  };

  return (
    <AdminContext.Provider value={{
      authChecked, isAdminAuthenticated, isKitchenAuthenticated, login, logout,
      reservations, addReservation, updateReservationStatus, deleteReservation, refreshReservations,
      messages, addMessage, markMessageRead, deleteMessage, refreshMessages,
      menuItems, menuLoading, menuError, addMenuItem, updateMenuItem, deleteMenuItem, refreshMenu,
      getSettings, updateSettings, changePassword, siteSettings,
      tables, addTable, removeTable,
      orders, addOrder, updateOrderStatus, deleteOrder, markOrderPaid, getTableStatus, refreshOrders,
      galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      customQrImages, saveCustomQrImage, clearCustomQrImage
    }}>
      {children}
    </AdminContext.Provider>
  );
};