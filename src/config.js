// Centralized API base that switches by Vite envs
// Ensure VITE_API_URL is set in .env (dev) and .env.production (prod)
const apiRoot = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const isDev = import.meta.env.MODE === 'development';
export const BASE_URL = (apiRoot && !isDev) ? `${apiRoot}/api/v1` : '/api/v1';
// export const token = localStorage.getItem('token');
export const token = () => localStorage.getItem('token') || null;
