import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(username, password);
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'kitchen') {
        setError('These are kitchen staff credentials. Use the Kitchen login instead.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] shadow-sm border border-primary/5 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-3xl text-primary mb-2">Brew & Hearth</h1>
          <p className="text-secondary text-sm">Admin Panel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface rounded-2xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm font-bold text-on-error-container bg-error-container p-3 rounded-xl">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-xs text-secondary/40 text-center mt-6">
          Demo credentials — admin / brewhearth123
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;