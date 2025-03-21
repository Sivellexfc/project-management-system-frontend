// src/AuthProvider.js
import React, { createContext, useContext, useEffect } from 'react';
import api from './api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Cookie'den access token'ı alıyoruz
  const accessToken = Cookies.get('accessToken');

  // API request interceptor ile access token'ı başlığa ekliyoruz
  useEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  // API response interceptor ile 403 hatası alırsak token'ı yeniliyoruz
  useEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await api.post('/auth/refresh');
            const { accessToken } = response.data;
            Cookies.set('accessToken', accessToken, { expires: 7, secure: true }); // Token'ı cookie'ye kaydediyoruz
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest); // Yeniden aynı request'i gönderiyoruz
          } catch (err) {
            console.error('Token yenileme hatası:', err);
            Cookies.remove('accessToken'); // Token yenilenemediğinde cookie'yi temizle
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [accessToken]);

  // Kullanıcı bilgilerini almak için hook ekleyebilirsin (jwtDecode kullanarak)
  const getUserFromToken = () => {
    if (!accessToken) return null;
    
    try {
      const user = jwtDecode(accessToken); // Token'dan kullanıcıyı çıkart
      return user;
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user: getUserFromToken() }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext'ten erişim sağlayan bir hook oluşturduk
export const useAuth = () => {
  return useContext(AuthContext);
};
