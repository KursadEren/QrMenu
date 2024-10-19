const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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



//JWT tokwn
// JWT doğrulama middleware'i
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send({ message: 'Token gerekli' });

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) return res.status(403).send({ message: 'Token geçersiz' });
    req.user = user; // Token'dan gelen kullanıcı bilgilerini alıyoruz
    next();
  });
}


app.post('/api/register', async (req, res) => {
  const { email, username, phone, pass } = req.body;

  if (!email || !username || !phone || !pass) {
    return res.status(400).send({
      success: false,
      message: 'Tüm alanlar doldurulmalıdır.',
    });
  }

  try {
    // Aynı e-posta adresinin olup olmadığını kontrol edin
    const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      // Eğer aynı e-posta adresi zaten varsa, hata mesajı döndür
      return res.status(400).send({
        success: false,
        message: 'Bu e-posta adresi zaten kayıtlı.',
      });
    }

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

// giriş api
app.post('/login', async (req, res) => {
  const { email, pass } = req.body;

  try {
    // Kullanıcıyı eposta ile veritabanından al
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Şifreyi karşılaştır
      const isMatch = await bcrypt.compare(pass, user.pass);
      if (isMatch) {
        // Kullanıcı giriş yaptıktan sonra last_login sütununu güncelle
        const updateLastLoginQuery = 'UPDATE users SET last_login = NOW() WHERE id = $1';
        await pool.query(updateLastLoginQuery, [user.id]);

        // JWT token oluştur
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
          console.log(token);
        res.json({
          success: true,
          message: 'Giriş başarılı',
          token, // Token'ı frontend'e gönderiyoruz
          user,
        });
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

// api ile menü bilgilerini çekmek 
app.get('/api/menus', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Token'dan gelen kullanıcı ID'sini alıyoruz.

  try {
    // Kullanıcının şirketine ait company_id'yi buluyoruz.
    const userQuery = 'SELECT company_id FROM Users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const companyId = userResult.rows[0]?.company_id;

    if (!companyId) {
      return res.status(404).send({ message: 'Kullanıcının bağlı olduğu bir şirket bulunamadı.' });
    }

    // Şirkete ait menüyü alıyoruz.
    const menuQuery = `
      SELECT m.menu_name, c.category_name, c.image AS category_image, p.product_name, p.description, p.image AS product_image, p.price
      FROM Menu m
      JOIN Menu_Category mc ON m.id = mc.menu_id
      JOIN Category c ON mc.category_id = c.id
      JOIN Category_Product cp ON c.id = cp.category_id
      JOIN Product p ON cp.product_id = p.id
      WHERE m.id = $1
    `;
    const menuResult = await pool.query(menuQuery, [companyId]);

    if (menuResult.rows.length === 0) {
      return res.status(404).send({ message: 'Bu şirketin menüsü bulunamadı.' });
    }

    const formattedMenus = {};
    menuResult.rows.forEach(row => {
      // Her kategori için menü formatını oluşturuyoruz.
      if (!formattedMenus[row.menu_name]) {
        formattedMenus[row.menu_name] = {
          categories: []
        };
      }

      const existingCategory = formattedMenus[row.menu_name].categories.find(cat => cat.name === row.category_name);

      if (!existingCategory) {
        formattedMenus[row.menu_name].categories.push({
          name: row.category_name,
          image: row.category_image,
          products: [
            {
              name: row.product_name,
              description: row.description,
              image: row.product_image,
              price: row.price
            }
          ]
        });
      } else {
        // Eğer kategori zaten varsa, ürünleri ekliyoruz.
        existingCategory.products.push({
          name: row.product_name,
          description: row.description,
          image: row.product_image,
          price: row.price
        });
      }
    });

    res.status(200).json(formattedMenus);
  } catch (error) {
    console.error('Menü getirirken bir hata oluştu:', error);
    res.status(500).send({ message: 'Menü getirirken bir hata oluştu.', error: error.message });
  }
});


// Firma Bilgileri Kaydı 
// Menü oluşturma endpoint'i
app.post('/api/menu', authenticateToken, async (req, res) => {
  const { generalMenu, menus } = req.body; // Frontend'den gelen generalMenu ve menus dizisi
  const userId = req.user.userId; // Token'dan kullanıcı ID'sini alıyoruz

  console.log('Kullanıcı ID:', userId);
  console.log('Gelen Menü Verileri:', generalMenu, menus);

  try {
    // Kullanıcının şirketine ait company_id'yi buluyoruz
    const userQuery = 'SELECT company_id FROM Users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    const companyId = userResult.rows[0]?.company_id;

    console.log('Şirket ID:', companyId);

    if (!companyId) {
      return res.status(404).send({ message: 'Kullanıcının bağlı olduğu bir şirket bulunamadı.' });
    }

    // General Menu (genel menü ismi) ekleme işlemi
    const menuQuery = 'INSERT INTO Menu (menu_name) VALUES ($1) RETURNING id';
    const menuValues = [generalMenu];  // Genel menü ismi, görsel olmayacak
    const menuResult = await pool.query(menuQuery, menuValues);
    const menuId = menuResult.rows[0].id;

    console.log('Oluşturulan Menü ID:', menuId);

    // Kategorileri menüye ekleme işlemi (menus dizisi)
    for (let category of menus) {
      const categoryQuery = 'INSERT INTO Category (category_name, image) VALUES ($1, $2) RETURNING id';
      const categoryValues = [category.name, category.image];  // Kategori ismi ve görseli
      const categoryResult = await pool.query(categoryQuery, categoryValues);
      const categoryId = categoryResult.rows[0].id;

      console.log('Oluşturulan Kategori ID:', categoryId);

      // Menü ve kategori arasındaki ilişkiyi Menu_Category tablosuna ekleme
      const menuCategoryQuery = 'INSERT INTO Menu_Category (menu_id, category_id) VALUES ($1, $2)';
      await pool.query(menuCategoryQuery, [menuId, categoryId]);

      // Ürünleri ekleme ve kategori ile ilişkilendirme işlemi
      for (let product of category.products) {
        const productQuery = 'INSERT INTO Product (product_name, description, image, price) VALUES ($1, $2, $3, $4) RETURNING id';
        const productValues = [product.name, product.description, product.image, product.price];  // Ürün bilgileri
        const productResult = await pool.query(productQuery, productValues);
        const productId = productResult.rows[0].id;

        console.log('Oluşturulan Ürün ID:', productId);

        // Ürün ve kategori arasındaki ilişkiyi Category_Product tablosuna ekleme
        const categoryProductQuery = 'INSERT INTO Category_Product (category_id, product_id) VALUES ($1, $2)';
        await pool.query(categoryProductQuery, [categoryId, productId]);
      }
    }

    // Şirketin menü_id'sini güncelleme işlemi
    const companyQuery = 'UPDATE Company SET menu_id = $1 WHERE id = $2';
    await pool.query(companyQuery, [menuId, companyId]);

    console.log('Menü ID, şirketle ilişkilendirildi:', companyId);

    res.status(201).send({ message: 'Menü ve ürünler başarıyla kaydedildi!' });

  } catch (error) {
    console.error('Menü oluşturulurken hata oluştu:', error);
    res.status(500).send({ message: 'Menü oluşturulurken bir hata oluştu.', error: error.message });
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
