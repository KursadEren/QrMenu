// src/components/WhatsAppOrder.js
import React, { useState } from 'react';

function WhatsAppOrder() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderMessage, setOrderMessage] = useState('Yeni Sipariş: {#ORDER_ID}\n{ORDER_DETAILS}');

  const handleSave = () => {
    alert(`WhatsApp Numarası: ${phoneNumber}\nSipariş Mesajı: ${orderMessage}`);
  };

  return (
    <div>
      <h1>WhatsApp Siparişi</h1>
      <div>
        <label>WhatsApp Numarası:</label>
        <input
          type="tel"
          placeholder="+90"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label>Sipariş Mesajı:</label>
        <textarea
          value={orderMessage}
          onChange={(e) => setOrderMessage(e.target.value)}
          rows="5"
          cols="50"
        />
      </div>
      <button onClick={handleSave}>Kaydet</button>
    </div>
  );
}

export default WhatsAppOrder;
