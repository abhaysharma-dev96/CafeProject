import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Printer, ClipboardList } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { compressImage } from '../utils/compressImage';

const AdminQRCodes = () => {
  const { tables, addTable, removeTable, customQrImages, saveCustomQrImage, clearCustomQrImage } = useAdmin();
  const [newTable, setNewTable] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [error, setError] = useState('');
  const qrRefs = useRef({});

  const baseUrl = window.location.origin;

  const handleAddTable = async (e) => {
    e.preventDefault();
    const label = newTable.trim();
    if (!label) return;
    const success = await addTable(label);
    if (!success) {
      setError('That table already exists.');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setNewTable('');
  };

  const printQR = (tableLabel) => {
    const wrapperEl = qrRefs.current[tableLabel];
    const svgEl = wrapperEl?.querySelector('svg');
    if (!svgEl) return;
    const svgMarkup = svgEl.outerHTML;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Table ${tableLabel} QR</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0;">
          <h2>Table ${tableLabel}</h2>
          ${svgMarkup}
          <p style="color:#666;margin-top:12px;">Scan to view menu &amp; order</p>
          <script>
            window.onload = () => setTimeout(() => window.print(), 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const safe = async (action) => {
    try {
      await action();
      setEditingId(null);
      setCustomQrUrl('');
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCustomQrUpload = (event, tableId) => {
    const file = event.target.files?.[0];
    if (!file) return;
    safe(async () => saveCustomQrImage(tableId, await compressImage(file, { maxSize: 900 })));
  };

  const saveCustomQrUrl = (tableId) => {
    const value = customQrUrl.trim();
    if (!value) {
      safe(() => clearCustomQrImage(tableId));
      return;
    }
    // An already-uploaded image shows up as /api/... — nothing to change
    if (value.startsWith('/api/')) {
      setEditingId(null);
      setCustomQrUrl('');
      return;
    }
    safe(() => saveCustomQrImage(tableId, value));
  };

  return (
    <div>
      <h1 className="font-headline-md text-4xl text-primary mb-2">Table QR Codes</h1>
      <p className="text-secondary/60 mb-8">Each table gets a unique QR code. Scanning it opens the menu pre-linked to that table, so orders route straight to the kitchen.</p>

      <form onSubmit={handleAddTable} className="flex gap-3 mb-10">
        <input
          type="text"
          placeholder="e.g. T9"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          className="bg-white px-4 py-3 rounded-xl border border-primary/10 outline-none focus:ring-2 focus:ring-primary/10 w-48"
        />
        <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          <Plus size={18} /> Add Table
        </button>
      </form>
      {error && <p className="text-sm font-bold text-on-error-container bg-error-container inline-block px-4 py-2 rounded-xl mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table, i) => {
          const url = `${baseUrl}/menu?table=${table.label}`;
          const status = table.status;
          return (
            <motion.div
              key={table._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white p-6 rounded-[24px] shadow-sm border flex flex-col items-center text-center ${
                status === 'occupied' ? 'border-error/30' : 'border-primary/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-primary">Table {table.label}</h3>
                <span className={`w-2 h-2 rounded-full ${status === 'occupied' ? 'bg-error' : 'bg-tertiary-fixed-dim'}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
                status === 'occupied'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}>
                {status === 'occupied' ? 'Occupied' : 'Available'}
              </span>
              <div
                ref={(el) => { if (el) qrRefs.current[table.label] = el; }}
                className="bg-white p-3 rounded-xl border border-primary/10 mb-4"
              >
                {customQrImages[table._id] ? (
                  <img src={customQrImages[table._id]} alt={`Custom QR for ${table.label}`} className="w-[140px] h-[140px] rounded-lg object-cover" />
                ) : (
                  <QRCodeSVG
                    value={url}
                    size={140}
                    fgColor="#271310"
                    bgColor="#ffffff"
                  />
                )}
              </div>
              <p className="text-[10px] text-secondary/40 break-all mb-4">{url}</p>

              {editingId === table._id ? (
                <div className="w-full space-y-2 mb-3">
                  <input
                    type="text"
                    placeholder="Paste QR image URL"
                    value={customQrUrl}
                    onChange={(e) => setCustomQrUrl(e.target.value)}
                    className="w-full bg-surface p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/10"
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer rounded-lg bg-primary/10 text-primary text-center text-[10px] font-bold py-2">
                      Upload File
                      <input type="file" accept="image/*" onChange={(e) => handleCustomQrUpload(e, table._id)} className="hidden" />
                    </label>
                    <button onClick={() => saveCustomQrUrl(table._id)} className="flex-1 bg-primary text-white rounded-lg text-[10px] font-bold py-2">Save</button>
                  </div>
                  <button onClick={() => { setEditingId(null); setCustomQrUrl(''); }} className="w-full text-[10px] font-bold text-secondary">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(table._id);
                    setCustomQrUrl(customQrImages[table._id] || '');
                  }}
                  className="w-full bg-primary/5 text-primary py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all mb-2"
                >
                  {customQrImages[table._id] ? 'Edit Custom QR' : 'Upload Custom QR'}
                </button>
              )}

              <Link
                to={`/admin/orders?table=${table.label}`}
                className="w-full flex items-center justify-center gap-1 bg-primary/5 text-primary py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all mb-2"
              >
                <ClipboardList size={14} /> View Orders
              </Link>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => printQR(table.label)}
                  className="flex-1 flex items-center justify-center gap-1 bg-surface text-secondary py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove Table ${table.label}?`)) removeTable(table._id);
                  }}
                  className="p-2 rounded-xl bg-surface text-secondary hover:bg-error-container hover:text-on-error-container transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminQRCodes;