import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const DropZone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  cursor: pointer;
  
  &:hover {
    border-color: #17a2b8;
  }
`;

const MenuImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ImageUploader = ({ image, setImage }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);  // Geçici URL oluşturma
    setImage(imageUrl);  // Geçici URL'i kaydet
  }, [setImage]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Yalnızca resim dosyalarını kabul ediyoruz
    multiple: false, // Tek dosya yüklemeye izin veriyoruz
  });

  return (
    <div>
      <DropZone {...getRootProps()}>
        <input {...getInputProps()} />
        {image ? (
          <MenuImage src={image} alt="Uploaded" />
        ) : (
          <p>Görsel yüklemek için buraya tıklayın veya sürükleyip bırakın.</p>
        )}
      </DropZone>
    </div>
  );
};

export default ImageUploader;
