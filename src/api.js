const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Wraps fetch: always sends cookies (for login sessions), always parses JSON,
// and throws a readable error message if the backend returns a failure.
export const apiCall = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};