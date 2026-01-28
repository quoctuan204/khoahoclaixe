const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const cron = require('node-cron');

dotenv.config();

const app = express();

// 1. SECURITY: Helmet (Bảo mật Headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. SECURITY: CORS (Chỉ cho phép Frontend gọi API)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cấu hình URL frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- FILE UPLOAD CONFIG ---
// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Registration = require('./models/Registration');
const Contact = require('./models/Contact');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Settings = require('./models/Settings');
const News = require('./models/News');

// --- AUTOMATIC BACKUP ---
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const performBackup = async () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-mm-ss
  const currentBackupDir = path.join(backupDir, timestamp);
  
  if (!fs.existsSync(currentBackupDir)) {
    fs.mkdirSync(currentBackupDir);
  }

  console.log(`[Backup] Starting backup at ${timestamp}...`);

  try {
    const models = {
      Registration,
      Contact,
      Admin,
      Product,
      Settings,
      News
    };

    for (const [name, model] of Object.entries(models)) {
      const data = await model.find({});
      fs.writeFileSync(
        path.join(currentBackupDir, `${name}.json`),
        JSON.stringify(data, null, 2)
      );
    }
    console.log(`[Backup] Completed successfully: ${currentBackupDir}`);
  } catch (error) {
    console.error('[Backup] Failed:', error);
  }
};

// Schedule backup daily at 02:00 AM
cron.schedule('0 2 * * *', performBackup);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 3. SECURITY: Rate Limiting (Chống Spam/DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 request mỗi IP
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
});
app.use('/api/', limiter);

// Function to send email
const sendEmail = async (subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject,
      text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Validate Vietnamese phone number
const isValidPhoneNumber = (phone) => {
  return /^(03|05|07|08|09)\d{8}$/.test(phone);
};

// Validate Email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --- ENCRYPTION HELPERS ---
// QUAN TRỌNG: Key này phải cố định. Nếu đổi key, dữ liệu cũ (SĐT, CCCD) sẽ không giải mã được.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Kiểm tra độ dài Key ngay khi khởi động để tránh lỗi runtime
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
  console.error('LỖI CẤU HÌNH NGHIÊM TRỌNG: Biến môi trường ENCRYPTION_KEY không được thiết lập hoặc không hợp lệ.');
  console.error('ENCRYPTION_KEY phải là một chuỗi HEX dài 64 ký tự (32 bytes). Hãy tạo và thêm nó vào file .env');
  process.exit(1); // Dừng server ngay lập tức để báo lỗi
}

const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

const decrypt = (text) => {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    if (textParts.length < 2) return text; // Not encrypted
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return text;
  }
};

// Route for course registration
app.post('/api/register-course', async (req, res) => {
  try {
    if (!req.body.phone || !isValidPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ (10 số, đầu 03/05/07/08/09)' });
    }

    if (!req.body.email || !isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Địa chỉ Email không hợp lệ' });
    }

    // Encrypt sensitive data before saving
    const dbData = { ...req.body };
    if (dbData.phone) dbData.phone = encrypt(dbData.phone);
    if (dbData.cccd) dbData.cccd = encrypt(dbData.cccd);

    const registration = new Registration(dbData);
    await registration.save();

    const { firstName, lastName, phone, email, course, courseName, cccd, address, note } = req.body; 

    const subject = 'Đăng ký khóa học mới';
    const text = `
      Đăng ký khóa học: ${courseName || course}
      Họ: ${lastName}
      Tên: ${firstName}
      SĐT: ${phone}
      Email: ${email}
      CCCD: ${cccd || 'N/A'}
      Địa chỉ: ${address || 'N/A'}
      Ghi chú: ${note || 'N/A'}
    `;

    await sendEmail(subject, text);

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving registration' });
  }
});

// Route to get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ _id: -1 });
    // Decrypt data before sending to Admin
    const decryptedRegistrations = registrations.map(reg => {
      const r = reg.toObject();
      if (r.phone) r.phone = decrypt(r.phone);
      if (r.cccd) r.cccd = decrypt(r.cccd);
      return r;
    });
    res.status(200).json(decryptedRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

// Route to get a single registration
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    const r = registration.toObject();
    if (r.phone) r.phone = decrypt(r.phone);
    if (r.cccd) r.cccd = decrypt(r.cccd);
    res.json(r);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registration' });
  }
});

// Route to update a registration
app.put('/api/registrations/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Encrypt if updating sensitive fields
    if (updateData.phone) updateData.phone = encrypt(updateData.phone);
    if (updateData.cccd) updateData.cccd = encrypt(updateData.cccd);

    const updatedRegistration = await Registration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    const r = updatedRegistration.toObject();
    if (r.phone) r.phone = decrypt(r.phone);
    if (r.cccd) r.cccd = decrypt(r.cccd);
    res.json(r);
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration' });
  }
});

// --- PRODUCT ROUTES ---

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Update Product (Admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, upsert: true } // Tạo mới nếu chưa tồn tại
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Create Product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// --- NEWS ROUTES ---

// Get all news
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// Get single news
app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news detail' });
  }
});

// Create news
app.post('/api/news', async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

// Update news
app.put('/api/news/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

// Delete news
app.delete('/api/news/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

// --- SETTINGS ROUTES ---

// Get Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update Settings
app.put('/api/settings', async (req, res) => {
  try {
    // Cập nhật document đầu tiên tìm thấy hoặc tạo mới nếu chưa có (upsert logic thủ công để đảm bảo chỉ có 1 doc)
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings(req.body);
    else Object.assign(settings, req.body);
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Route to delete a registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Registration.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting registration' });
  }
});

// --- AUTHENTICATION ROUTES ---

// Login Route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Chỉ cho phép sai mật khẩu 5 lần trong 15 phút
  message: 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 1. Ưu tiên kiểm tra trong Database
    const adminInDb = await Admin.findOne({ username });
    
    if (adminInDb) {
      // So sánh mật khẩu đã mã hóa
      const isMatch = await bcrypt.compare(password, adminInDb.password);
      if (isMatch) {
        // Tạo JWT Token thật
        const token = jwt.sign(
          { id: adminInDb._id, username: adminInDb.username, role: adminInDb.role },
          process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi',
          { expiresIn: '1d' }
        );
        return res.json({ token, role: 'admin', username: username });
      }
    }
    
    // 2. Fallback: Kiểm tra biến môi trường (Chỉ dùng khi chưa có Admin trong DB)
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === envUser && password === envPass) {
       // Tạo JWT Token tạm
       const token = jwt.sign(
        { username: envUser, role: 'admin' },
        process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi',
        { expiresIn: '1d' }
      );
      return res.json({ token, role: 'admin', username: envUser });
    } else {
      res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Change Password Route
app.post('/api/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  try {
    const adminInDb = await Admin.findOne({ username });
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    let isCurrentPassValid = false;

    if (adminInDb) {
      isCurrentPassValid = await bcrypt.compare(currentPassword, adminInDb.password);
    } else if (username === envUser && currentPassword === envPass) {
      isCurrentPassValid = true;
    }

    if (!isCurrentPassValid) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });

    // Mã hóa mật khẩu mới trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Admin.findOneAndUpdate({ username }, { password: hashedPassword }, { upsert: true, new: true });
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi đổi mật khẩu' });
  }
});

// Verify Token Route (AuthContext sẽ gọi API này khi reload trang)
app.get('/api/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi');
    res.json({ username: decoded.username, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route for contact advice
app.post('/api/contact-advice', async (req, res) => {
  try {
    if (!req.body.phone || !isValidPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ (10 số, đầu 03/05/07/08/09)' });
    }

    const contactData = { ...req.body };
    // Encrypt phone
    if (contactData.phone) contactData.phone = encrypt(contactData.phone);

    const contact = new Contact(contactData);
    await contact.save();

    const { fullname, phone, course, note } = req.body;

    const subject = 'Yêu cầu tư vấn mới';
    const text = `
      Tư vấn từ: ${fullname}
      SĐT: ${phone}
      Khóa học: ${course || 'N/A'}
      Nội dung: ${note || 'N/A'}
    `;

    await sendEmail(subject, text);

    res.status(200).json({ message: 'Advice request successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving contact' });
  }
});

// Route to get all contacts (Admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ _id: -1 });
    const decryptedContacts = contacts.map(c => {
      const obj = c.toObject();
      if (obj.phone) obj.phone = decrypt(obj.phone);
      return obj;
    });
    res.status(200).json(decryptedContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Route to update contact status
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.phone) updateData.phone = encrypt(updateData.phone);

    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    const c = updatedContact.toObject();
    if (c.phone) c.phone = decrypt(c.phone);
    res.status(200).json(c);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contact' });
  }
});

// Route to delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});