import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, X as XIcon, Eye } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DetailModal, { DetailRow } from '../components/DetailModal';

const AdminReservations = () => {
  const { reservations, updateReservationStatus, deleteReservation } = useAdmin();
  const [viewing, setViewing] = useState(null);
  const viewed = viewing ? reservations.find((r) => r._id === viewing) : null;

  return (
    <div>
      <h1 className="font-headline-md text-4xl text-primary mb-8">Reservations</h1>

      {reservations.length === 0 ? (
        <div className="bg-white p-12 rounded-[32px] text-center border border-primary/5">
          <p className="text-secondary/50">No reservations yet. New reservations from the website will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-primary/5 overflow-x-auto">
          <table className="w-full text-sm min-w-[850px]">
            <thead>
              <tr className="text-left text-secondary/50 text-xs uppercase tracking-widest border-b border-primary/5">
                <th className="p-5">Name</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Date & Time</th>
                <th className="p-5">Party</th>
                <th className="p-5">Notes</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {reservations.map((r) => (
                  <motion.tr
                    key={r._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-primary/5 last:border-0"
                  >
                    <td className="p-5 font-bold text-primary">{r.name}</td>
                    <td className="p-5 text-secondary">
                      {r.phone ? <a href={`tel:${r.phone}`} className="block hover:text-primary">{r.phone}</a> : <span className="block text-secondary/40">—</span>}
                      {r.email ? <a href={`mailto:${r.email}`} className="block text-xs hover:text-primary break-all">{r.email}</a> : null}
                    </td>
                    <td className="p-5 text-secondary">{r.date} — {r.time}</td>
                    <td className="p-5 text-secondary">{r.partySize}</td>
                    <td className="p-5 text-secondary/60 max-w-[200px] truncate">{r.notes || '—'}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        r.status === 'confirmed' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                        r.status === 'cancelled' ? 'bg-error-container text-on-error-container' :
                        'bg-secondary-container text-on-secondary-container'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewing(r._id)}
                          className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary text-white text-xs font-bold hover:shadow-lg transition-all"
                          title="View details"
                        >
                          <Eye size={14} /> View
                        </button>
                        {r.status !== 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(r._id, 'confirmed')}
                            className="p-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:scale-110 transition-transform"
                            title="Confirm"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            onClick={() => updateReservationStatus(r._id, 'cancelled')}
                            className="p-2 rounded-full bg-error-container text-on-error-container hover:scale-110 transition-transform"
                            title="Cancel"
                          >
                            <XIcon size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete reservation for ${r.name}? This cannot be undone.`)) {
                              deleteReservation(r._id);
                            }
                          }}
                          className="p-2 rounded-full bg-surface text-secondary hover:bg-primary hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {viewed && (
          <DetailModal title="Reservation" onClose={() => setViewing(null)}>
            <DetailRow label="Name">{viewed.name}</DetailRow>
            <DetailRow label="Phone">
              {viewed.phone ? <a href={`tel:${viewed.phone}`} className="text-primary underline">{viewed.phone}</a> : '—'}
            </DetailRow>
            <DetailRow label="Email">
              {viewed.email ? <a href={`mailto:${viewed.email}`} className="text-primary underline break-all">{viewed.email}</a> : '—'}
            </DetailRow>
            <DetailRow label="Date & Time">{viewed.date} — {viewed.time}</DetailRow>
            <DetailRow label="Party Size">{viewed.partySize}</DetailRow>
            <DetailRow label="Notes / Special Requests">{viewed.notes || '—'}</DetailRow>
            <DetailRow label="Status"><span className="capitalize font-bold">{viewed.status}</span></DetailRow>
            <DetailRow label="Booked On">{new Date(viewed.createdAt).toLocaleString()}</DetailRow>
            <div className="mt-6 flex gap-3">
              {viewed.status !== 'confirmed' && (
                <button onClick={() => updateReservationStatus(viewed._id, 'confirmed')} className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed py-3 rounded-2xl font-bold hover:scale-[1.02] transition-transform">Confirm</button>
              )}
              {viewed.status !== 'cancelled' && (
                <button onClick={() => updateReservationStatus(viewed._id, 'cancelled')} className="flex-1 bg-error-container text-on-error-container py-3 rounded-2xl font-bold hover:scale-[1.02] transition-transform">Cancel</button>
              )}
            </div>
          </DetailModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReservations;