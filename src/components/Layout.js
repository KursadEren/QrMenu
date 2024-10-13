// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../Context/AuthContext';

const Layout = () => {
  const { user } = useAuth(); // Kullanıcı bilgisi AuthContext'ten alınır
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {user && <Navbar toggleSidebar={toggleSidebar} />}
      <div style={{ display: 'flex' }}>
        {user && <Sidebar />}
        <div
          style={{
            flex: 1,
            marginLeft: user && isSidebarOpen ? '250px' : '0px', // Sidebar'a göre padding ayarlaması
            marginTop: user ? '60px' : '0px', // Navbar yüksekliği kadar yukarıya boşluk bırak
            transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
            padding: '20px', // İçerik alanına padding ekle
          }}
        >
          <Outlet /> {/* Bu, her sayfa için içerik gösterilecek alan */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
