// src/services/chatApi.js
import axios from 'axios';

const chatApi = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

// Добавь перехватчик для токена если надо:
chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default chatApi;
