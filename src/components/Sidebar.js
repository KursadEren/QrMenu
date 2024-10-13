// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaTachometerAlt,
  FaUtensils,
  FaPlus,
  FaQrcode,
  FaFileImport,
  FaWhatsapp,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext'; // useAuth hook'u ile AuthContext'ten logout fonksiyonu alınır

// Stil bileşenleri
const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2c3e50; /* Daha modern bir sidebar rengi */
  height: 100vh;
  padding: 20px;
  color: #ecf0f1;
  position: fixed;
  top: 60px; /* Navbar'ın altında yer alacak şekilde konumlandır */
  left: 0;
  overflow-y: auto;
  z-index: 999;

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 150px;
  }
`;

const MenuTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  color: #ecf0f1;
  margin-bottom: 20px;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const MenuItem = styled.li`
  margin: 15px 0;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px); /* Hover efekti ile biraz sağa kaydır */
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #ecf0f1;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px; /* Kenarları biraz yuvarlat */
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #34495e;
    transform: scale(1.05); /* Hafif bir büyütme efekti */
  }

  svg {
    margin-right: 15px;
    font-size: 20px; /* İkon boyutunu büyüt */
  }
`;



function Sidebar() {


  return (
    <SidebarContainer>
      <MenuTitle>Menü</MenuTitle>
      <MenuList>
        <MenuItem>
          <StyledLink to="/">
            <FaTachometerAlt /> Gösterge Paneli
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/restaurant-info">
            <FaUtensils /> Firma Bilgileri
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/add-menu">
            <FaPlus /> Menü Ekle
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/qr-generator">
            <FaQrcode /> QR Oluşturucu
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/import-export">
            <FaFileImport /> Import/Export
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/whatsapp-order">
            <FaWhatsapp /> WhatsApp Sipariş
          </StyledLink>
        </MenuItem>
      </MenuList>
      {/* Çıkış Yap Butonu */}
     
    </SidebarContainer>
  );
}

export default Sidebar;
