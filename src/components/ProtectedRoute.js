// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Kullanıcı oturum açmamışsa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  // Kullanıcı oturum açmışsa çocuk bileşenleri göster
  return children;
};

export default ProtectedRoute;
