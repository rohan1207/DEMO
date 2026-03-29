import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('DRIP_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
