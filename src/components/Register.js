import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoImage from '../assets/reklam.jpg'; // Logo görseli

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0e0e0e, #333);
  overflow: hidden;
`;

const Navbar = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
`;

const FormWrapper = styled.div`
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0;
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
  background-color: #f8f8f8;
  color: #333;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 200px;
  padding: 12px;
  background: linear-gradient(135deg, #654ea3, #eaafc8);
  margin: 16px 0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

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
    color: #654ea3;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(''); // Hata mesajı durumu
  const [success, setSuccess] = useState(''); // Başarı mesajı durumu
  const navigate = useNavigate();

  // Kayıt işlemi fonksiyonu
  const handleRegister = async () => {
    const createdAt = new Date().toISOString();
    const lastLogin = new Date().toISOString();

    // Girişlerin boş olup olmadığını kontrol et
    if (!email || !password || !username || !phone) {
      setError('Lütfen tüm alanları doldurun!');
      setSuccess(''); // Başarı mesajını sıfırla
      return;
    }

    const userData = {
      eposta: email,
      kullanici_adi: username,
      sifre: password,
      telefon: phone,
      last_login: lastLogin,
      created_at: createdAt,
    };

    try {
      // Axios ile POST isteği gönder
      const response = await axios.post('http://localhost:5000/api/register', userData);

      if (response.data.success) {
        setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
        setError(''); // Hata mesajını sıfırla
        setTimeout(() => {
          navigate('/login'); // 2 saniye sonra giriş sayfasına yönlendir
        }, 2000);
      } else {
        setError(response.data.message || 'Kayıt sırasında bir hata oluştu.');
        setSuccess(''); // Başarı mesajını sıfırla
      }
    } catch (error) {
      setError('Kayıt işlemi sırasında bir hata oluştu: ' );
      setSuccess(''); // Başarı mesajını sıfırla
    }
  };

  return (
    <Container>
      <Navbar>
        <Logo src={LogoImage} alt="Logo" />
      </Navbar>
      <FormWrapper>
        <Title>Kayıt Ol</Title>
        <Input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Telefon Numarası"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleRegister}>Kayıt Ol</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <TextLink>
          Zaten bir hesabınız var mı? <a href="/login">Giriş Yap</a>
        </TextLink>
      </FormWrapper>
    </Container>
  );
}

export default Register;
