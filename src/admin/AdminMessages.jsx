import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminMessages = () => {
  const { messages, markMessageRead, deleteMessage } = useAdmin();

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
                <p className="text-secondary text-sm leading-relaxed mb-4">{m.message}</p>
                <div className="flex justify-end gap-2">
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
    </div>
  );
};

export default AdminMessages;