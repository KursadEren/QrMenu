// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
