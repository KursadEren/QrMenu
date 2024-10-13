import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { MenuContext } from '../Context/MenuContext';
import { FaTrash, FaEdit } from 'react-icons/fa';
import ProductModal from './ProductModal'; 

const Container = styled.div`
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #17a2b8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #138496;
  }
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const MenuInfo = styled.div`
  display: flex;
  align-items: center;
`;

const MenuImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
  cursor: pointer;
`;

const MenuName = styled.div`
  font-size: 16px;
  margin-right: 15px;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const EditButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  cursor: pointer;
  
  &:hover {
    border-color: #17a2b8;
  }
`;

function AddMenu() {
  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);

  const { menus, addMenu, deleteMenu, editMenu } = useContext(MenuContext);

  const handleAddMenu = (e) => {
    e.preventDefault();
    if (!menuImage) {
      alert('Lütfen bir menü görseli yükleyin.');
      return;
    }

    if (isEditing) {
      const updatedMenu = {
        id: currentMenuId,
        name: menuName,
        image: menuImage,
        products: currentMenu ? currentMenu.products : []
      };
      editMenu(currentMenuId, updatedMenu);
      setIsEditing(false);
    } else {
      const newMenu = { id: Date.now(), name: menuName, image: menuImage, products: [] };
      addMenu(newMenu);
    }

    setMenuName('');
    setMenuImage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMenuImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const openModal = (menu) => {
    setCurrentMenu(menu);
    setModalOpen(true);
  };

  const handleProductAdd = () => {
    setModalOpen(false); // Close modal after adding products
  };

  const handleDelete = (menuId) => {
    deleteMenu(menuId);
  };

  const handleEdit = (menuId) => {
    const selectedMenu = menus.find(menu => menu.id === menuId);
    if (selectedMenu) {
      setMenuName(selectedMenu.name);
      setMenuImage(selectedMenu.image);
      setCurrentMenuId(menuId);
      setIsEditing(true);
    }
  };

  const handleDropZoneClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <Container>
      <Header>{isEditing ? 'Menüyü Düzenle' : 'Menü Oluştur'}</Header>
      <form onSubmit={handleAddMenu}>
        <Input
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Menü adı girin"
          required
        />
        <DropZone
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleDropZoneClick} // Tıklama işlemi için
        >
          {menuImage ? (
            <MenuImage src={menuImage} alt="Menü Görseli" />
          ) : (
            <p>Görsel yüklemek için buraya sürükleyip bırakın veya yüklemek için tıklayın.</p>
          )}
        </DropZone>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Button type="submit">{isEditing ? 'Güncelle' : 'Menü Ekle'}</Button>
      </form>

      <h2>Oluşturulan Menüler</h2>
      <MenuList>
        {menus.length > 0 ? (
          menus.map((menu) => (
            <MenuItem key={menu.id}>
              <MenuInfo>
                <MenuImage 
                  src={menu.image} 
                  alt={menu.name}
                  onClick={() => openModal(menu)}
                />
                <MenuName>{menu.name}</MenuName>
              </MenuInfo>
              <div>
                <EditButton onClick={() => handleEdit(menu.id)}>
                  <FaEdit /> Düzenle
                </EditButton>
                <DeleteButton onClick={() => handleDelete(menu.id)}>
                  <FaTrash /> Sil
                </DeleteButton>
              </div>
            </MenuItem>
          ))
        ) : (
          <p>Henüz bir menü eklenmedi.</p>
        )}
      </MenuList>

      {modalOpen && (
        <ProductModal
          menuId={currentMenu.id}
          isOpen={modalOpen}
          onClose={handleProductAdd}
          currentMenu={currentMenu} 
        />
      )}
    </Container>
  );
}

export default AddMenu;
