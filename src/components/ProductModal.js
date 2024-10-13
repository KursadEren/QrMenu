import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { MenuContext } from '../Context/MenuContext';

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

const Header = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
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

const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  background-color: ${(props) => (props.primary ? '#28a745' : '#17a2b8')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: ${(props) => (props.primary ? '#218838' : '#138496')};
  }
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`;

const ProductItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #f9f9f9;

  &:hover {
    background-color: #f1f1f1;
  }

  strong {
    color: #333;
  }

  button {
    padding: 8px 12px;
    font-size: 14px;
    background-color: #ffc107;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #e0a800;
    }
  }
`;

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin: 10px 0;
  cursor: pointer;

  &:hover {
    border-color: #17a2b8;
  }
`;

function ProductModal({ isOpen, onClose, currentMenu, menuId }) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const { editMenu, menus } = useContext(MenuContext);

  // Load existing products for the selected menu
  useEffect(() => {
    if (menuId) {
      const selectedMenu = menus.find(menu => menu.id === menuId);
      if (selectedMenu) {
        setProducts(selectedMenu.products);
      }
    }
  }, [menuId, menus]);

  // Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file && file['type'].split('/')[0] === 'image';
      if (isImage) {
        setProductImage(URL.createObjectURL(file));
      } else {
        alert('Lütfen geçerli bir resim dosyası yükleyin.');
      }
    }
  };

  // Handle form submission to add or update a product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productImage && !editingProduct) {
      alert('Lütfen bir ürün görseli yükleyin.');
      return;
    }

    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: productName,
      price: productPrice,
      description: productDescription,
      image: productImage || (editingProduct && editingProduct.image), // Retain existing image if editing
    };

    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id ? newProduct : product
      ));
      setEditingProduct(null);
    } else {
      setProducts([...products, newProduct]);
    }

    // Reset form
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setProductImage(null);
  };

  // Delete a product from the list
  const handleDelete = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);

    const selectedMenu = menus.find(menu => menu.id === menuId);
    if (selectedMenu) {
      const updatedMenu = {
        ...selectedMenu,
        products: updatedProducts,
      };
      editMenu(menuId, updatedMenu); // Update the menu with the new product list in context
    }
  };

  // Edit an existing product by finding it based on the productId
  const handleEdit = (product) => {
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDescription(product.description);
    setProductImage(product.image);
    setEditingProduct(product); 
  };

  // Save updated product list and close the modal
  const handleSaveAndClose = () => {
    const updatedMenu = {
      ...currentMenu,
      products,
    };
    editMenu(menuId, updatedMenu);
    onClose(products);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const isImage = file && file['type'].split('/')[0] === 'image';
      if (isImage) {
        setProductImage(URL.createObjectURL(file));
      } else {
        alert('Lütfen geçerli bir resim dosyası yükleyin.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return isOpen ? (
    <ModalWrapper>
      <ModalContent>
        <Header>{currentMenu ? `${currentMenu.name} Menüsüne Ürün Ekle/Düzenle` : 'Ürün Ekle'}</Header>
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
          <DropZone
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {productImage ? (
              <img src={productImage} alt="Ürün Görseli" style={{ width: '100%', borderRadius: '8px' }} />
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
          <ButtonGroup>
            <Button type="submit">{editingProduct ? 'Ürünü Güncelle' : 'Ürün Ekle'}</Button>
            <Button type="button" onClick={handleSaveAndClose}>Kaydet ve Kapat</Button>
          </ButtonGroup>
        </form>

        <h3>Eklenen Ürünler</h3>
        <ProductList>
          {products.map((product) => (
            <ProductItem key={product.id}>
              <div>
                <strong>{product.name}</strong> - {product.price} TL
              </div>
              <div>
                <button onClick={() => handleEdit(product)}>Düzenle</button>
                <button onClick={() => handleDelete(product.id)}>Sil</button>
              </div>
            </ProductItem>
          ))}
        </ProductList>
      </ModalContent>
    </ModalWrapper>
  ) : null;
}

export default ProductModal;
