import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MailOpen, Eye } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DetailModal, { DetailRow } from '../components/DetailModal';

const AdminMessages = () => {
  const { messages, markMessageRead, deleteMessage } = useAdmin();
  const [viewing, setViewing] = useState(null);

  const openMessage = (m) => {
    setViewing(m);
    if (!m.read) markMessageRead(m._id);
  };

  return (
    <div>
      <h1 className="font-headline-md text-4xl text-primary mb-8">Messages</h1>

      {messages.length === 0 ? (
        <div className="bg-white p-12 rounded-[32px] text-center border border-primary/5">
          <p className="text-secondary/50">No messages yet. Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`bg-white p-6 rounded-[24px] border transition-all ${m.read ? 'border-primary/5' : 'border-primary/20 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    <div>
                      <p className="font-bold text-primary">{m.name}</p>
                      <p className="text-secondary/60 text-sm">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest bg-secondary-container/40 text-secondary px-3 py-1 rounded-full">
                    {m.subject}
                  </span>
                </div>
                <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-2">{m.message}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openMessage(m)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:shadow-lg transition-all"
                    title="View full message"
                  >
                    <Eye size={14} /> View
                  </button>
                  {!m.read && (
                    <button
                      onClick={() => markMessageRead(m._id)}
                      className="p-2 rounded-full bg-surface text-secondary hover:bg-primary hover:text-white transition-all"
                      title="Mark as read"
                    >
                      <MailOpen size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete message from ${m.name}? This cannot be undone.`)) {
                        deleteMessage(m._id);
                      }
                    }}
                    className="p-2 rounded-full bg-surface text-secondary hover:bg-error-container hover:text-on-error-container transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {viewing && (
          <DetailModal title="Message" onClose={() => setViewing(null)}>
            <DetailRow label="From">{viewing.name}</DetailRow>
            <DetailRow label="Email"><a href={`mailto:${viewing.email}`} className="text-primary underline break-all">{viewing.email}</a></DetailRow>
            <DetailRow label="Subject">{viewing.subject}</DetailRow>
            <DetailRow label="Received">{new Date(viewing.createdAt).toLocaleString()}</DetailRow>
            <DetailRow label="Message">{viewing.message}</DetailRow>
            <a
              href={`mailto:${viewing.email}?subject=${encodeURIComponent('Re: ' + viewing.subject)}`}
              className="mt-6 block text-center bg-primary text-white py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              Reply by Email
            </a>
          </DetailModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;