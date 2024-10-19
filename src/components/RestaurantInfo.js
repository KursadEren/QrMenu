// src/components/RestaurantInfo.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios'; // axios import edildi

const Container = styled.div`
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0px auto; /* Ortalamak için */
`;

const Header = styled.h1`
  display: flex;
  align-items: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const IconWrapper = styled.div`
  margin-right: 10px;
  font-size: 30px;
  color: #28a745;
`;

const Content = styled.div`
  font-size: 16px;
  color: #555;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

function RestaurantInfo() {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

   useEffect(()=>{
       console.log(localStorage.getItem("menus"));
   },[])
   const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token'); // Token'ı localStorage'dan alıyoruz
  
      const response = await axios.post(
        'http://localhost:5000/api/restaurant',
        {
          company_name: restaurantName,
          phone: phoneNumber,
          address: address, // 'adress' değil, 'address'
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı başlık olarak ekliyoruz
          },
        }
      );
  
      alert(response.data.message);
      setRestaurantName('');
      setAddress('');
      setPhoneNumber('');
      setDescription('');
      setErrorMessage(''); // Başarılı mesaj
    } catch (error) {
      console.error('Kafe bilgileri kaydedilirken hata oluştu:', error);
      setErrorMessage('Kafe bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  
  return (
    <Container>
      <Header>
        <IconWrapper>
          <FaInfoCircle />
        </IconWrapper>
        Firma adınızı giriniz
      </Header>
      <Content>
        Lütfen aşağıdaki formu doldurarak kafe veya restoranınızın bilgilerini giriniz.
      </Content>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Form onSubmit={handleSubmit}>
        <Label>Firma İsmi</Label>
        <Input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="Kafe Adını Giriniz"
          required
        />
        
        <Label>Adres</Label>
        <TextArea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adres Bilgisi Giriniz"
          rows="4"
          required
        />

        <Label>Telefon Numarası</Label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="örn: +90xxxxx"
          required
        />

        <Label>Açıklama</Label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kafe hakkında kısa bir açıklama giriniz"
          rows="4"
        />

        <Button type="submit">Bilgileri Kaydet</Button>
      </Form>
    </Container>
  );
}

export default RestaurantInfo;
