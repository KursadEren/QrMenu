import React, { createContext, useState, useEffect } from 'react';

export const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);

  // İlk olarak localStorage'dan menüleri yükle
  useEffect(() => {
    const storedMenus = JSON.parse(localStorage.getItem('menus') || '[]');
    setMenus(storedMenus);
  }, []);

  // Menüler her güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
  }, [menus]);

  // Yeni bir menü ekleme fonksiyonu
  const addMenu = (menu) => {
    setMenus([...menus, { id: menu.id, name: menu.name, image: menu.image, products: [] }]);
  };

  // Belirli bir menüye ürün ekleme fonksiyonu
  const addProductToMenu = (menuId, product) => {
    const updatedMenus = menus.map((menu) => 
      menu.id === menuId ? { ...menu, products: [...menu.products, product] } : menu
    );
    setMenus(updatedMenus);
  };

  // Menü silme fonksiyonu
  const deleteMenu = (menuId) => {
    const updatedMenus = menus.filter(menu => menu.id !== menuId);
    setMenus(updatedMenus);
  };

  // Menü düzenleme fonksiyonu
  const editMenu = (menuId, updatedMenu) => {
    const updatedMenus = menus.map((menu) =>
      menu.id === menuId ? { ...menu, ...updatedMenu } : menu
    );
    setMenus(updatedMenus);
  };

  return (
    <MenuContext.Provider value={{ menus, addMenu, addProductToMenu, deleteMenu, editMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
