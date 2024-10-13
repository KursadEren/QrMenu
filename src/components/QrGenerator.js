import React, { useState } from 'react';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
import { useDropzone } from 'react-dropzone';
import { SketchPicker } from 'react-color';
import { FaQrcode } from 'react-icons/fa';

// Stil bileşenleri
const Container = styled.div`
  padding: 30px;
  background-color: #f0f0f5;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 40px;
`;

const Header = styled.h1`
  display: flex;
  align-items: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
`;

const IconWrapper = styled.div`
  margin-right: 15px;
  font-size: 35px;
  color: #ffc107;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
`;

const ControlPanel = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 100%;
  margin-top: 20px;
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-right: 40px;
`;

const FileDropZone = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #fafafa;
  margin-bottom: 15px;
  border-radius: 10px;
  color: #555;
  width: 100%;
  margin-top: 20px;
`;

const ColorPickerWrapper = styled.div`
  margin-bottom: 20px;
`;

const ControlLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
`;

const ControlInput = styled.input`
  width: 120px;
  margin-left: 10px;
`;

const QRWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 20px;
`;

const OverlayImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  transform: translate(-50%, -50%);
  object-fit: cover;
  border-radius: ${(props) => (props.circular ? '50%' : '0')};
  opacity: ${(props) => props.opacity};
`;

function QrGenerator() {
  const [qrValue, setQrValue] = useState(''); // QR kod için metin değeri
  const [uploadedImage, setUploadedImage] = useState(null); // Yüklenen görsel
  const [imageSize, setImageSize] = useState(50); // Görsel boyutu
  const [opacity, setOpacity] = useState(1); // Görsel şeffaflık
  const [circular, setCircular] = useState(true); // Görselin yuvarlak olup olmaması
  const [foregroundColor, setForegroundColor] = useState('#000000'); // QR kod noktalarının rengi
  const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // QR kod arka plan rengi

  // Görsel yükleme işlemi
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedImage(URL.createObjectURL(file));
    },
  });

  // QR kod ve görseli yeniden oluşturma fonksiyonu
  const generateQRCode = () => {
    if (qrValue || uploadedImage) {
      return (
        <QRWrapper>
          <QRCodeCanvas
            value={qrValue}
            size={300}
            bgColor={backgroundColor}
            fgColor={foregroundColor}
            level="H" // Yüksek hata toleransı
          />
          {uploadedImage && (
            <OverlayImage
              src={uploadedImage}
              alt="QR Logo"
              size={imageSize}
              circular={circular}
              opacity={opacity}
            />
          )}
        </QRWrapper>
      );
    }
    return null;
  };

  return (
    <Container>
      {/* Başlık ve Metin Girişi */}
      <Header>
        <IconWrapper>
          <FaQrcode />
        </IconWrapper>
        QR Kod Oluşturucu
      </Header>

      {/* Görsel Yükleme Alanı */}
      <FileDropZone {...getRootProps()}>
        <input {...getInputProps()} />
        {uploadedImage ? (
          <p>Görsel yüklendi! Yeni bir görsel yüklemek için tıklayın.</p>
        ) : (
          <p>Bir görsel yüklemek için tıklayın veya sürükleyip bırakın.</p>
        )}
      </FileDropZone>

      {/* QR Kod İçin Metin Girişi */}
      <Input
        type="text"
        placeholder="QR kod için metin girin"
        value={qrValue}
        onChange={(e) => setQrValue(e.target.value)}
      />

      {/* Renk ve Ayar Panelleri */}
      <ControlPanel>
        <ControlSection>
          <ColorPickerWrapper>
            <ControlLabel>QR Kod Nokta Rengi:</ControlLabel>
            <SketchPicker
              color={foregroundColor}
              onChangeComplete={(color) => setForegroundColor(color.hex)}
            />
          </ColorPickerWrapper>

          <ColorPickerWrapper>
            <ControlLabel>QR Kod Arka Plan Rengi:</ControlLabel>
            <SketchPicker
              color={backgroundColor}
              onChangeComplete={(color) => setBackgroundColor(color.hex)}
            />
          </ColorPickerWrapper>

          <div>
            <ControlLabel>Görsel Boyutu:</ControlLabel>
            <ControlInput
              type="range"
              min="10"
              max="150"
              value={imageSize}
              onChange={(e) => setImageSize(Number(e.target.value))}
            />
          </div>
          <div>
            <ControlLabel>Yuvarlak Görsel:</ControlLabel>
            <input
              type="checkbox"
              checked={circular}
              onChange={() => setCircular(!circular)}
            />
          </div>
          <div>
            <ControlLabel>Görsel Opaklığı:</ControlLabel>
            <ControlInput
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>
        </ControlSection>

        {/* QR Kodun Gösterimi */}
        <div style={{ width: '35%', textAlign: 'center' }}>
          {generateQRCode()}
        </div>
      </ControlPanel>
    </Container>
  );
}

export default QrGenerator;
