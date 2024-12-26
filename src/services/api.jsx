// src/api.js
import axios from 'axios';

// Axios instance oluşturma
const api = axios.create({
  baseURL: 'http://localhost:8085/api/v1', // API'nin temel URL'sini buraya ekleyin
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie gönderimini etkinleştir
});

export default api;