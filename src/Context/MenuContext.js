import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

const MenuProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);

  // Menü ekleme fonksiyonu
  const addMenu = (menu) => {
    const newMenu = {
      id: menu.id || Date.now(),  // Menü ID'sini otomatik oluşturuyoruz
      name: menu.name || "Menu Name",  // Menü adı
      image: menu.image || "Menu Image URL",  // Menü görseli
      products: menu.products || [] // Ürünler dizisi, boş olabilir veya ürünlerle birlikte gelebilir
    };

    setMenus([...menus, newMenu]); // Menüyü ve ürünleri ekliyoruz
  };

  // Menü silme fonksiyonu
  const deleteMenu = (menuId) => {
    const updatedMenus = menus.filter((menu) => menu.id !== menuId);
    setMenus(updatedMenus);
  };

  // Menü düzenleme fonksiyonu
  const editMenu = (menuId, updatedMenu) => {
    const updatedMenus = menus.map((menu) => 
      menu.id === menuId ? { ...menu, ...updatedMenu } : menu
    );
    setMenus(updatedMenus);
  };

  // Belirli bir menüye ürün ekleme fonksiyonu
  const addProductToMenu = (menuId, product) => {
    const updatedMenus = menus.map((menu) => 
      menu.id === menuId 
        ? { 
            ...menu, 
            products: [
              ...menu.products, 
              {
                id: product.id || Date.now(),  // Ürünün ID'sini otomatik oluşturuyoruz
                name: product.name || "Product Name",  // Ürün adı
                price: product.price || 0,  // Ürün fiyatı
                description: product.description || "Product Description",  // Ürün açıklaması
                image: product.image || "Product Image URL"  // Ürün görseli
              }
            ] 
          } 
        : menu
    );
    setMenus(updatedMenus);
  };

  // Belirli bir menüde ürün silme fonksiyonu
  const deleteProductFromMenu = (menuId, productId) => {
    const updatedMenus = menus.map((menu) => 
      menu.id === menuId 
        ? { 
            ...menu, 
            products: menu.products.filter((product) => product.id !== productId)
          } 
        : menu
    );
    setMenus(updatedMenus);
  };

  // Ürün güncelleme fonksiyonu
  const editProductInMenu = (menuId, updatedProduct) => {
    const updatedMenus = menus.map((menu) => 
      menu.id === menuId 
        ? { 
            ...menu, 
            products: menu.products.map((product) =>
              product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            )
          } 
        : menu
    );
    setMenus(updatedMenus);
  };

  return (
    <MenuContext.Provider value={{ menus, addMenu, deleteMenu, editMenu, addProductToMenu, deleteProductFromMenu, editProductInMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
