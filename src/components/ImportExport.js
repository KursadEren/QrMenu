import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFileExcel } from 'react-icons/fa';

const Container = styled.div`
  padding: 30px;
  background-color: #f0f0f5;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
`;

const Section = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  color: #007bff;
  margin-bottom: 20px;
`;

const FileUpload = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #fafafa;
  margin-bottom: 15px;
  border-radius: 10px;
  color: #555;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const UploadIcon = styled(FaFileExcel)`
  font-size: 40px;
  margin-bottom: 10px;
  color: #28a745;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ExportButton = styled.button`
  background-color: #17a2b8;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #138496;
  }
`;

function ImportExport() {
  const [categoryFile, setCategoryFile] = useState(null);
  const [productFile, setProductFile] = useState(null);

  const handleCategoryUpload = (e) => {
    setCategoryFile(e.target.files[0]);
  };

  const handleProductUpload = (e) => {
    setProductFile(e.target.files[0]);
  };

  const handleUpload = () => {
    alert(`Kategori Dosyası: ${categoryFile ? categoryFile.name : 'Yüklenmedi'}
Ürün Dosyası: ${productFile ? productFile.name : 'Yüklenmedi'}`);
  };

  return (
    <Container>
      <Header>Import/Export İşlemleri</Header>

      {/* Kategori Yükleme Bölümü */}
      <Section>
        <SectionTitle>Kategori Yükle</SectionTitle>
        <FileUpload>
          <UploadIcon />
          <p>Kategori dosyasını yüklemek için tıklayın veya sürükleyip bırakın.</p>
          <UploadInput type="file" onChange={handleCategoryUpload} />
          <UploadButton onClick={() => document.querySelector('input[type="file"]').click()}>
            Dosya Seç
          </UploadButton>
        </FileUpload>
      </Section>

      {/* Ürün Yükleme Bölümü */}
      <Section>
        <SectionTitle>Ürün Yükle</SectionTitle>
        <FileUpload>
          <UploadIcon />
          <p>Ürün dosyasını yüklemek için tıklayın veya sürükleyip bırakın.</p>
          <UploadInput type="file" onChange={handleProductUpload} />
          <UploadButton onClick={() => document.querySelectorAll('input[type="file"]')[1].click()}>
            Dosya Seç
          </UploadButton>
        </FileUpload>
      </Section>

      {/* Dosya Yükleme Butonu */}
      <UploadButton onClick={handleUpload}>Dosyaları Yükle</UploadButton> 

      <hr style={{ width: '100%', margin: '30px 0' }} />

      {/* Dışa Aktarma Bölümü */}
      <Section>
        <SectionTitle>Kategori Dışa Aktar</SectionTitle>
        <ExportButton onClick={() => alert('Kategoriler dışa aktarıldı.')}>Kategorileri Dışa Aktar</ExportButton>
      </Section>

      <Section>
        <SectionTitle>Ürünleri Dışa Aktar</SectionTitle>
        <ExportButton onClick={() => alert('Ürünler dışa aktarıldı.')}>Ürünleri Dışa Aktar</ExportButton>
      </Section>
    </Container>
  );
}

export default ImportExport;
