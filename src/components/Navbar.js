// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../Context/AuthContext'; // useAuth hook'u ile AuthContext'ten logout fonksiyonu alınır

const NavbarContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: #34495e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed; /* Navbar'ı sabit yap */
  top: 0;
  left: 0;
  z-index: 1000; /* Sidebar'ın üstünde yer alacak */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Gölgelendirme efekti ekleyin */

  @media (max-width: 768px) {
    padding: 0 10px; /* Küçük ekranlar için padding'i azalt */
  }
`;

const Title = styled.h1`
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px; /* Küçük ekranlar için yazı boyutunu küçült */
  }
`;

const LogoutButton = styled.button`
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }

  @media (max-width: 768px) {
    padding: 8px 12px; /* Küçük ekranlar için butonun boyutunu ayarla */
    font-size: 14px; /* Küçük ekranlar için yazı boyutunu ayarla */
  }
`;

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useAuth(); // AuthContext'ten logout fonksiyonunu al

  return (
    <NavbarContainer>
      <div onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
        &#9776; {/* Menu icon (hamburger) */}
      </div>
      <Title>QR Menü</Title>
      <LogoutButton onClick={logout}>Çıkış Yap</LogoutButton>
    </NavbarContainer>
  );
};

export default Navbar;
