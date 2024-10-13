// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout'; // Layout bileşenini import et
import Dashboard from './components/Dashboard';
import RestaurantInfo from './components/RestaurantInfo';
import AddMenu from './components/AddMenu';
import QrGenerator from './components/QrGenerator';
import ImportExport from './components/ImportExport';
import WhatsAppOrder from './components/WhatsAppOrder';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext'; // AuthContext import edildi
import Register from './components/Register';
import MenuProvider from './Context/MenuContext';

function App() {
  return (
    <Router>
     
      <AuthProvider>
      <MenuProvider>
        <Routes>
          {/* Giriş sayfası */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Layout ile korunan rotalar */}
          <Route path="/*" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="restaurant-info"
              element={
                <ProtectedRoute>
                  <RestaurantInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-menu"
              element={
                <ProtectedRoute>
                  <AddMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="qr-generator"
              element={
                <ProtectedRoute>
                  <QrGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="import-export"
              element={
                <ProtectedRoute>
                  <ImportExport />
                </ProtectedRoute>
              }
            />
            <Route
              path="whatsapp-order"
              element={
                <ProtectedRoute>
                  <WhatsAppOrder />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        </MenuProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
