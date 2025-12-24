// Centralized API base that switches by Vite envs
// Ensure VITE_API_URL is set in .env (dev) and .env.production (prod)
const apiRoot = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const BASE_URL = apiRoot ? `${apiRoot}/api/v1` : '/api/v1';
// export const token = localStorage.getItem('token');
export const token = () => localStorage.getItem('token') || null;
