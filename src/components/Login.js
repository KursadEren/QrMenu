import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../assets/reklam.jpg'; // Navbar logosu olarak kullanmak için görsel
import axios from 'axios';

// Stil bileşenleri
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw; /* Genişliği tam ekran yap */
 
  background: linear-gradient(135deg, #0e0e0e, #333); /* Arka plan renkleri */
  overflow: hidden; /* Taşmaları engellemek için */
`;

const Navbar = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #000; /* Navbar arka plan rengi */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  left: 1px;
`;

const FormWrapper = styled.div`
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%; /* Genişliği tam ekran yap */
  max-width: 400px; /* Form boyutunu sınırlamak için maksimum genişlik */
  margin: 0; /* Kenar boşluklarını sıfırla */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 30px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 20px;
    max-width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #f8f8f8; /* Giriş kutusu arka planı */
  color: #333;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  width: 100%; /* Buton genişliğini tüm kutuya yay */
  max-width: 200px; /* Buton genişliğini sınırlamak için maksimum genişlik */
  padding: 12px;
  background-color: #28a745;
  margin: 16px 0; /* Butonun üst ve altından boşluk bırak */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  background: linear-gradient(135deg, #654ea3, #eaafc8);

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #0e0e0e;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const TextLink = styled.p`
  text-align: center;
  margin-top: 10px;
  color: #0e0e0e;

  a {
    color: #654ea3; /* Link rengi */
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // AuthContext'ten login fonksiyonu alınır
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log(response);
      if (response) {
        navigate('/'); // Giriş başarılıysa ana sayfaya yönlendirme
      }
    } catch (error) {
      console.error('Giriş sırasında hata oluştu:', error);
      setErrorMessage('Giriş sırasında hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Container>
      <Navbar>
        <Logo src={LogoImage} alt="Logo" />
      </Navbar>
      <FormWrapper>
        <Title>Giriş Yap</Title>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Giriş Yap</Button>
        <TextLink>
          Hesabınız yok mu? <a href="/register">Kayıt Ol</a>
        </TextLink>
      </FormWrapper>
    </Container>
  );
}

export default Login;
