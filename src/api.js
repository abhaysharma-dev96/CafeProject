const API_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`
);

// Wraps fetch: always sends cookies (for login sessions), always parses JSON,
// and throws a readable error message if the backend returns a failure.
export const apiCall = async (endpoint, options = {}) => {
  let res;

  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
  } catch (err) {
    throw new Error('Backend is not reachable right now. Please check that the server is running and try again.');
  }

  let data = {};

  try {
    const text = await res.text();
    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    data = {};
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('Too many requests. Please wait a few minutes and try again later.');
    }
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};