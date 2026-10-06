import React, { useState } from 'react';
import { Check, X as XIcon, Trash2, Star, Eye } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import DetailModal, { DetailRow } from '../components/DetailModal';

const filters = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' }
];

const Stars = ({ value }) => (
  <div className="flex gap-0.5" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={16} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-secondary/20'} />
    ))}
  </div>
);

const AdminReviews = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdmin();
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(null);

  const shown = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);
  const count = (key) => (key === 'all' ? reviews.length : reviews.filter((r) => r.status === key).length);

  const run = async (action) => {
    setError('');
    try { await action(); } catch (err) { setError(err.message || 'Something went wrong.'); }
  };

  // Approve/reject from inside the popup, then close it
  const decide = async (review, status) => {
    await run(() => updateReviewStatus(review._id, status));
    setViewing(null);
  };

  const statusStyle = (status) =>
    status === 'approved' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
    status === 'rejected' ? 'bg-error-container text-on-error-container' :
    'bg-secondary-container text-on-secondary-container';

  return (
    <div>
      <h1 className="font-headline-md text-4xl text-primary mb-2">Reviews</h1>
      <p className="text-secondary/60 text-sm mb-6">Only approved reviews are shown on the website's home page.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${filter === f.key ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-primary/10 hover:border-primary/30'}`}
          >
            {f.label} ({count(f.key)})
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm font-bold text-red-600">{error}</p>}

      {shown.length === 0 ? (
        <div className="bg-white p-12 rounded-[32px] text-center border border-primary/5">
          <p className="text-secondary/50">No {filter === 'all' ? '' : filter} reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r._id} className="bg-white p-6 rounded-[24px] border border-primary/5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-primary">{r.name}</p>
                  <div className="mt-1"><Stars value={r.rating} /></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyle(r.status)}`}>{r.status}</span>
                  <span className="text-xs text-secondary/50">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="mt-4 text-secondary leading-relaxed line-clamp-3">{r.comment}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setViewing(r)}
                  title="View full review"
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:shadow-lg transition-all"
                >
                  <Eye size={14} /> View
                </button>
                {r.status !== 'approved' && (
                  <button onClick={() => run(() => updateReviewStatus(r._id, 'approved'))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold hover:scale-105 transition-transform">
                    <Check size={14} /> Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => run(() => updateReviewStatus(r._id, 'rejected'))} className="flex items-center gap-1 px-4 py-2 rounded-full bg-error-container text-on-error-container text-xs font-bold hover:scale-105 transition-transform">
                    <XIcon size={14} /> Reject
                  </button>
                )}
                <button
                  onClick={() => { if (window.confirm(`Delete review by ${r.name}? This cannot be undone.`)) run(() => deleteReview(r._id)); }}
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-surface text-secondary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {viewing && (
          <DetailModal title="Review" onClose={() => setViewing(null)}>
            <DetailRow label="From">{viewing.name}</DetailRow>
            <DetailRow label="Rating">
              <div className="flex items-center gap-2">
                <Stars value={viewing.rating} />
                <span className="text-sm">{viewing.rating} / 5</span>
              </div>
            </DetailRow>
            <DetailRow label="Status">
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyle(viewing.status)}`}>{viewing.status}</span>
            </DetailRow>
            <DetailRow label="Submitted">{new Date(viewing.createdAt).toLocaleString()}</DetailRow>
            <DetailRow label="Review">{viewing.comment}</DetailRow>
            <div className="mt-6 flex gap-3">
              {viewing.status !== 'approved' && (
                <button onClick={() => decide(viewing, 'approved')} className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed text-sm font-bold hover:shadow-lg transition-all">
                  <Check size={16} /> Approve
                </button>
              )}
              {viewing.status !== 'rejected' && (
                <button onClick={() => decide(viewing, 'rejected')} className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl bg-error-container text-on-error-container text-sm font-bold hover:shadow-lg transition-all">
                  <XIcon size={16} /> Reject
                </button>
              )}
            </div>
          </DetailModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;