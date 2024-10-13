// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { FaTachometerAlt } from 'react-icons/fa';

// Stil bileşenleri
const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  margin: auto auto;
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
  color: #007bff;
`;

const InfoBoxContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const InfoBox = styled.div`
  width: 200px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const InfoTitle = styled.h3`
  color: #555;
  font-size: 18px;
`;

const InfoValue = styled.p`
  font-size: 24px;
  color: #007bff;
  margin-top: 10px;
`;

function Dashboard() {
  // State değişkenleri tanımlama
  const [qrScanCount, setQrScanCount] = useState(0); // QR kod tarama sayısı
  const [siteVisitCount, setSiteVisitCount] = useState(0); // Site ziyaret sayısı
  const [data, setData] = useState([]); // Grafik verisi

  // Veri alma fonksiyonu (bu fonksiyonu API çağrısı ile değiştirebilirsiniz)
  useEffect(() => {
    // Örnek veriler
    setQrScanCount(42); // Örnek QR kod tarama sayısı
    setSiteVisitCount(120); // Örnek site ziyaret sayısı
    setData([
      { name: '01 Oct', value: 10 },
      { name: '02 Oct', value: 15 },
      { name: '03 Oct', value: 7 },
      { name: '04 Oct', value: 12 },
      { name: '05 Oct', value: 20 },
    ]);
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <IconWrapper>
          <FaTachometerAlt />
        </IconWrapper>
        Gösterge Paneli
      </Header>
      {/* QR Kod Tarama ve Site Ziyaret Bilgileri */}
      <InfoBoxContainer>
        <InfoBox>
          <InfoTitle>QR Kod Taramaları</InfoTitle>
          <InfoValue>{qrScanCount}</InfoValue>
        </InfoBox>
        <InfoBox>
          <InfoTitle>Site Ziyaret Sayısı</InfoTitle>
          <InfoValue>{siteVisitCount}</InfoValue>
        </InfoBox>
      </InfoBoxContainer>
      {/* Grafik Gösterimi */}
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </DashboardContainer>
  );
}

export default Dashboard;
