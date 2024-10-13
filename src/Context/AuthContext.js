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
  const navigate = useNavigate();

  // Giriş yapma işlemi
  const login = async (email, password) => {
    try {
      // Backend'e giriş isteği gönderme
      const response = await axios.post('http://localhost:5000/login', {
        eposta: email,
        sifre: password,
      });

      if (response.data.success) {
        const userData = { email: response.data.user.eposta };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); // Giriş yapıldıktan sonra ana sayfaya yönlendirme
      } else {
        alert('Geçersiz e-posta veya şifre!');
      }
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      alert('Sunucuda bir hata oluştu.');
    }
  };

  // Çıkış yapma işlemi
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
