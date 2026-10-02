import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, X as XIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminReservations = () => {
  const { reservations, updateReservationStatus, deleteReservation } = useAdmin();

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
    </div>
  );
};

export default AdminReservations;