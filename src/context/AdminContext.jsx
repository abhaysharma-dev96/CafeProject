import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

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

  // Live updates: poll for new orders/reservations/messages/tables every few
  // seconds while logged in, so kitchen/admin see new customer activity
  // without needing to log out and back in or reload the page.
  useEffect(() => {
    if (!isKitchenAuthenticated) return;
    const interval = setInterval(() => {
      refreshOrders();
      refreshTables();
    }, 5000);
    return () => clearInterval(interval);
  }, [authRole]);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const interval = setInterval(() => {
      refreshReservations();
      refreshMessages();
    }, 8000);
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

  return (
    <AdminContext.Provider value={{
      authChecked, isAdminAuthenticated, isKitchenAuthenticated, login, logout,
      reservations, addReservation, updateReservationStatus, deleteReservation, refreshReservations,
      messages, addMessage, markMessageRead, deleteMessage, refreshMessages,
      menuItems, menuLoading, menuError, addMenuItem, updateMenuItem, deleteMenuItem, refreshMenu,
      getSettings, updateSettings, siteSettings,
      tables, addTable, removeTable,
      orders, addOrder, updateOrderStatus, deleteOrder, markOrderPaid, getTableStatus, refreshOrders
    }}>
      {children}
    </AdminContext.Provider>
  );
};