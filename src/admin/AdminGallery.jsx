import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { compressImage } from '../utils/compressImage';

const emptyForm = {
  id: null,
  title: '',
  category: 'Interior',
  image: ''
};

const AdminGallery = () => {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [originalImage, setOriginalImage] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = ['All', 'Interior', 'Food & Drink', 'Events'];
  const filteredItems = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const openAddForm = () => {
    setForm(emptyForm);
    setOriginalImage('');
    setEditingId(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    setForm({ ...item });
    setOriginalImage(item.image);
    setEditingId(item.id);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const image = await compressImage(file, { maxSize: 1400 });
      setForm((current) => ({ ...current, image }));
      setFormError('');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();

    if (trimmedTitle.length < 2) {
      setFormError('Title is required (at least 2 characters).');
      return;
    }

    if (!form.image) {
      setFormError('Please upload an image or paste an image URL.');
      return;
    }

    const payload = { title: trimmedTitle, category: form.category };
    // On edit, only send the image if it was actually changed
    if (!editingId || form.image !== originalImage) payload.image = form.image;

    setSaving(true);
    try {
      if (editingId) {
        await updateGalleryItem(editingId, payload);
      } else {
        await addGalleryItem(payload);
      }
      setIsFormOpen(false);
    } catch (err) {
      setFormError(err.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline-md text-4xl text-primary">Gallery</h1>
          <p className="text-secondary/60 mt-2">Upload and edit gallery images from the admin panel.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add Image
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full border text-sm font-bold tracking-wide transition-all ${
              activeFilter === category
                ? 'bg-primary text-white border-primary shadow-lg scale-105'
                : 'bg-white text-secondary border-primary/10 hover:border-primary/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-primary/5">
            <img src={item.image} alt={item.title} className="h-60 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/50 mb-2">{item.category}</p>
                  <h3 className="font-bold text-primary">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="p-2 rounded-full bg-surface text-secondary hover:bg-primary hover:text-white transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}"?`)) {
                        deleteGalleryItem(item.id).catch((err) => alert(err.message || 'Could not delete.'));
                      }
                    }}
                    className="p-2 rounded-full bg-surface text-secondary hover:bg-error-container hover:text-on-error-container transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
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
                <h2 className="font-headline-md text-2xl text-primary">{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
                <button onClick={() => setIsFormOpen(false)}><X size={22} className="text-secondary" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Image title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                />

                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                >
                  <option value="Interior">Interior</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Events">Events</option>
                </select>

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
                  type="text"
                  placeholder="Or paste image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-surface p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/10"
                />

                {form.image && (
                  <div className="rounded-xl border border-primary/10 bg-surface p-2">
                    <img src={form.image} alt="Preview" className="h-28 w-full rounded-lg object-cover" />
                  </div>
                )}

                {formError && (
                  <p className="text-sm font-bold text-on-error-container bg-error-container px-4 py-2 rounded-xl">{formError}</p>
                )}

                <button type="submit" disabled={saving} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60">
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Image'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
