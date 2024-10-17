const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const { Pool } = require('pg');

// Express uygulaması oluşturma
const app = express();
const port = 5000; // API sunucusunun dinleyeceği port

// Middleware ayarları
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL veritabanı bağlantı ayarları
const pool = new Pool({
  user: 'kursad', // PostgreSQL kullanıcı adı
  host: 'localhost', // Veritabanı sunucusunun adresi
  database: 'postgres', // Bağlanılacak veritabanı adı
  password: 'Kursad2512.', // PostgreSQL şifresi
  port: 5432, // PostgreSQL varsayılan portu
});

// Basit bir test endpoint'i
app.get('/', (req, res) => {
  res.send('QR Menü API Sunucusu Çalışıyor!');
});


// Basit bir test endpoint'i
app.get('/getUsers', (req, res) => { try {
  const query = 'SELECT * FROM users';
  const last_login = 0; //timestap kullanılacak alan
  
  

  res.json(result.rows[0]);
} catch (err) {
  console.error(err);
  res.status(500).send('Veritabanına eklenirken hata oluştu.');
}
});
// Kullanıcı eklemek için bir endpoint


app.post('/api/register', async (req, res) => {
  const { email, username, phone, pass } = req.body;

  if (!email || !username || !phone || !pass) {
    return res.status(400).send({
      success: false,
      message: 'Tüm alanlar doldurulmalıdır.',
    });
  }

  try {
    // Şifreyi hash'leyin
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Veritabanına ekleyin
    const query = 'INSERT INTO users (email, username, phone, pass, last_login, created_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *';
    const values = [email, username, phone, hashedPassword];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Kullanıcı kaydedilirken bir hata oluştu.',
      error: err.message,
    });
  }
});
app.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  

  try {
    // Kullanıcıyı eposta ile veritabanından al
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    console.log('Veritabanı sonucu:', result.rows); // Veritabanı sonucunu kontrol edin

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Şifreyi karşılaştır
      const isMatch = await bcrypt.compare(pass, user.pass);
      if (isMatch) {
        // Kullanıcı giriş yaptıktan sonra last_login sütununu güncelle
        const updateLastLoginQuery = 'UPDATE users SET last_login = NOW() WHERE id = $1';
        await pool.query(updateLastLoginQuery, [user.id]);

        res.json({ success: true, message: 'Giriş başarılı', user });
      } else {
        res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).send('Sunucuda bir hata oluştu.');
  }
});

  app.post('/api/restaurant', async (req, res) => {
    const { company_name, phone, adress, description } = req.body;

    if (!company_name) {
        return res.status(400).send({ message: company_name, phone,adress,description });
    }

    // Burada veritabanınıza kaydedebilirsiniz.
    try {
        const isactive = true;
        const query = 'INSERT INTO company (company_name, phone, address, description,isactive) VALUES ($1, $2, $3, $4,$5) RETURNING *';
        const values = [company_name, phone, adress, description,isactive];
        const result = await pool.query(query, values);
        res.status(201).send({
            message: 'Kafe bilgileri başarıyla kaydedildi!',
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Veri kaydedilirken bir hata oluştu.', error: error.message });
    }
});






// Ürün eklemek için bir endpoint
app.post('/api/product', async (req, res) => {
  const { urun_adi, urun_icerik, urun_gorsel } = req.body;

  if (!urun_adi || !urun_icerik ) {
    return res.status(400).send({ message: 'Tüm alanlar doldurulmalıdır.' });
  }

  try {
    const query = 'INSERT INTO product (urun_adi, urun_icerik, urun_gorsel) VALUES ($1, $2, $3) RETURNING *';
    const values = [urun_adi, urun_icerik, urun_gorsel];
    const result = await pool.query(query, values);

    // Menü-Ürün eşleştirmesi yapmak için menu_product tablosuna ekleme yapalım
    const product_id = result.rows[0].id;
    const menuProductQuery = 'INSERT INTO menu_product (menu_id, product_id) VALUES ($1, $2)';
    await pool.query(menuProductQuery, [menu_id, product_id]);

    res.status(201).send({
      message: 'Ürün başarıyla kaydedildi!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Ürün kaydedilirken bir hata oluştu.', error: error.message });
  }
});



// Sunucuyu dinlemeye başlama
app.listen(port, () => {
  console.log(`Sunucu port ${port} üzerinde çalışıyor`);
});
