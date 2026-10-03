import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/formatPrice';
import { compressImage } from '../utils/compressImage';

const ADD_NEW = '__add_new__';
const emptyForm = { name: '', price: '', category: 'Coffee', desc: '', tags: '', image: '', featured: false };

const AdminMenu = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const openAddForm = () => {
    setForm(emptyForm);
    setNewCategory('');
    setEditingId(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setForm({ ...item, price: item.price.toString(), tags: item.tags.join(', ') });
    setNewCategory('');
    setEditingId(item._id);
    setFormError('');
    setIsFormOpen(true);
  };

  const categoryOptions = [...new Set(['Coffee', 'Tea', 'Snacks', 'Desserts', ...menuItems.map((m) => m.category)])];

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const image = await compressImage(file, { maxSize: 900 });
      setForm((current) => ({ ...current, image }));
      setFormError('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const priceValue = parseFloat(form.price);

    if (!trimmedName) {
      setFormError('Item name is required.');
      return;
    }
    const categoryValue = (form.category === ADD_NEW ? newCategory : form.category).trim();
    if (categoryValue.length < 2) {
      setFormError('Please choose a category, or type the new category name (at least 2 letters).');
      return;
    }
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Price must be a number greater than 0.');
      return;
    }
    const isDuplicate = menuItems.some(
      (m) => m.name.toLowerCase() === trimmedName.toLowerCase() && m._id !== editingId
    );
    if (isDuplicate) {
      setFormError('An item with this name already exists.');
      return;
    }

    const payload = {
      name: trimmedName,
      price: priceValue,
      category: categoryValue,
      featured: !!form.featured,
      desc: form.desc,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image: form.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600'
    };

    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await addMenuItem(payload);
      }
      setIsFormOpen(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline-md text-4xl text-primary">Menu</h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-[24px] p-4 shadow-sm border border-primary/5">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-primary">{item.name}</h3>
              <span className="text-primary font-bold">{formatPrice(item.price)}</span>
            </div>
            <p className="text-xs text-secondary/50 uppercase tracking-wider font-bold mb-3">{item.category}{item.featured ? ' • Featured' : ''}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => openEditForm(item)}
                className="p-2 rounded-full bg-surface text-secondary hover:bg-primary hover:text-white transition-all"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
                    deleteMenuItem(item._id);
                  }
                }}
                className="p-2 rounded-full bg-surface text-secondary hover:bg-error-container hover:text-on-error-container transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-2xl text-primary">{editingId ? 'Edit Item' : 'Add Item'}</h2>
                <button onClick={() => setIsFormOpen(false)}><X size={22} className="text-secondary" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" required placeholder="Item name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number" step="0.01" required placeholder="Price (₹)"
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value={ADD_NEW}>+ Add new category</option>
                  </select>
                </div>
                {form.category === ADD_NEW && (
                  <input
                    type="text" required autoFocus maxLength={40} placeholder="New category name (e.g. Sandwiches)"
                    value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                  />
                )}
                <textarea
                  rows="3" placeholder="Description"
                  value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                />
                <input
                  type="text" placeholder="Tags (comma separated, e.g. Floral, Citrus)"
                  value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                />
                <label className="flex items-center gap-3 text-sm font-bold text-secondary">
                  <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Show on Home page (Signature Serves)
                </label>
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-secondary">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-2 block w-full text-sm text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary"
                    />
                  </label>

                  <input
                    type="url" placeholder="Or paste image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                  />

                  {form.image && (
                    <div className="rounded-xl border border-primary/10 bg-surface p-2">
                      <img src={form.image} alt="Menu preview" className="h-20 w-full rounded-lg object-cover" />
                    </div>
                  )}
                </div>
                {formError && (
                  <p className="text-sm font-bold text-on-error-container bg-error-container px-4 py-2 rounded-xl">{formError}</p>
                )}
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                  {editingId ? 'Save Changes' : 'Add Item'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenu;