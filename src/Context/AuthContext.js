import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// AuthContext oluşturma
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const navigate = useNavigate();

  // Giriş yapma işlemi
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        pass: password,
      });

      if (response.data.success) {
        const userData = { email: response.data.user.email };
        const tokenData = response.data.token; // Token backend'den geliyor
        setUser(userData);
        setToken(tokenData);

        // Token ve user bilgilerini localStorage'a kaydet
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);

        navigate('/'); // Giriş yapıldıktan sonra ana sayfaya yönlendirme
      } else {
        alert('Geçersiz e-posta veya şifre!');
      }
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      throw new Error('Giriş sırasında hata oluştu.');
    }
  };

  // Axios instance oluşturarak tüm isteklerde token'ı ekleyin
  const authAxios = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      Authorization: `Bearer ${token}`, // Token'ı başlık olarak ekliyoruz
    },
  });

  // Çıkış yapma işlemi
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
