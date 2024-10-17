import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { MenuContext } from '../Context/MenuContext';
import { FaTrash, FaEdit } from 'react-icons/fa';
import ImageUploader from './ImageUploader'; // ImageUploader bileşenini ekliyoruz

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
  flex-direction: column;
  align-items: flex-start;
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));  // Daha geniş kartlar
  gap: 15px;
  margin-top: 15px;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);  // Hover durumunda kart hafif yukarı çıkar
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ProductName = styled.h4`
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #28a745;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.4;
`;
const ProductActions = styled.div`
  display: flex;
  justify-content: space-between;
`;


const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const HeaderModal = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;



const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [productName, setProductName] = useState(product ? product.name : '');
  const [productPrice, setProductPrice] = useState(product ? product.price : '');
  const [productDescription, setProductDescription] = useState(product ? product.description : '');
  const [productImage, setProductImage] = useState(product ? product.image : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      name: productName,
      price: productPrice,
      description: productDescription,
      image: productImage,
    };
    onSave(updatedProduct);  // Ürünü güncelleme işlemi
    onClose();  // Modal kapatılıyor
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <HeaderModal>Ürünü Düzenle</HeaderModal>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Ürün Adı"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Ürün Fiyatı"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
          <TextArea
            placeholder="Ürün Açıklaması"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
          <ImageUploader image={productImage} setImage={setProductImage} />
          <ButtonGroup>
            <Button type="submit">Kaydet</Button>
            <Button type="button" onClick={onClose}>Kapat</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalWrapper>
  ) : null;
};



const ProductModal = ({ isOpen, onClose, menuId }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null); // Ürün görseli state'i sadece ProductModal için
  const { addProductToMenu } = useContext(MenuContext); // Context'ten ürün ekleme fonksiyonunu alıyoruz

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productImage) {
      alert('Lütfen bir ürün görseli yükleyin.');
      return;
    }

    const newProduct = {
      id: Date.now(),  // Ürün için benzersiz bir ID oluşturuluyor
      name: productName,
      price: productPrice,
      description: productDescription,
      image: productImage,  // Ürünün görseli
    };
      
    addProductToMenu(menuId, newProduct);  // Ürünü ilgili menüye ekliyoruz

    // Formu sıfırlama
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setProductImage(null); // Ürün görselini sıfırlıyoruz
    onClose(); // Modal kapatılıyor
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <HeaderModal>Menüye Ürün Ekle</HeaderModal>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Ürün Adı"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Ürün Fiyatı"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
          <TextArea
            placeholder="Ürün Açıklaması"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />

          {/* ImageUploader bileşeni burada kullanılıyor */}
          <ImageUploader image={productImage} setImage={setProductImage} />

          <ButtonGroup>
            <Button type="submit">Ürün Ekle</Button>
            <Button type="button" onClick={onClose}>Kapat</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalWrapper>
  ) : null;
};
function AddMenu() {
  const [menuName, setMenuName] = useState('');
  const [menuImage, setMenuImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { menus, addMenu, deleteMenu, editMenu, deleteProductFromMenu, editProductInMenu } = useContext(MenuContext);

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
      const newMenuId = Date.now();
      const newMenu = { id: newMenuId, name: menuName, image: menuImage, products: [] };
      addMenu(newMenu);
      setCurrentMenuId(newMenuId);
      setCurrentMenu(newMenu);
      setModalOpen(true);
    }

    setMenuName('');
    setMenuImage(null);
  };

  const openModal = (menu) => {
    setCurrentMenu(menu);
    setCurrentMenuId(menu.id);
    setModalOpen(true);
  };

  const handleProductAdd = () => {
    setModalOpen(false);
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

  // Ürün silme işlemi
  const handleDeleteProduct = (menuId, productId) => {
    deleteProductFromMenu(menuId, productId);
  };

  // Ürünü düzenlemek için modal açma işlemi
  const handleEditProduct = (menuId, product) => {
    setEditingProduct(product);
    setEditProductModalOpen(true);
  };

  // Ürünü kaydetme işlemi
  const handleSaveProduct = (updatedProduct) => {
    editProductInMenu(currentMenuId, updatedProduct);
    setEditProductModalOpen(false);
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

        {/* ImageUploader bileşeni burada kullanılıyor */}
        <ImageUploader image={menuImage} setImage={setMenuImage} />

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

              <h4>Ürünler:</h4>
              {menu.products.length > 0 ? (
                <ProductGrid>
                  {menu.products.map((product) => (
                    <ProductCard key={product.id}>
                      <ProductImage src={product.image} alt={product.name} />
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>{product.price} TL</ProductPrice>
                      <ProductDescription>{product.description}</ProductDescription>
                      <ProductActions>
                        <EditButton onClick={() => handleEditProduct(menu.id, product)}>
                          <FaEdit /> Düzenle
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteProduct(menu.id, product.id)}>
                          <FaTrash /> Sil
                        </DeleteButton>
                      </ProductActions>
                    </ProductCard>
                  ))}
                </ProductGrid>
              ) : (
                <p>Bu menüye henüz ürün eklenmedi.</p>
              )}

              <div>
                <EditButton onClick={() => handleEdit(menu.id)}>
                  <FaEdit /> Menü Düzenle
                </EditButton>
                <DeleteButton onClick={() => handleDelete(menu.id)}>
                  <FaTrash /> Menü Sil
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
          menuId={currentMenuId}
          isOpen={modalOpen}
          onClose={handleProductAdd}
        />
      )}

      {/* Ürün düzenleme modalı */}
      {editProductModalOpen && (
        <EditProductModal
          isOpen={editProductModalOpen}
          product={editingProduct}
          onClose={() => setEditProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </Container>
  );
}




export default AddMenu;

