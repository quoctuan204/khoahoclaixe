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
const Gallery = require('./models/Gallery');
const Video = require('./models/Video');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');

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
      News,
      Gallery,
      Video,
      Notification,
      AuditLog
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

// --- MIDDLEWARE & HELPERS ---

// Middleware to protect routes and get admin user
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi');
      req.adminId = decoded.id; // Get admin ID from token
      return next(); // Thêm return để đảm bảo dừng hàm tại đây
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const logActivity = async (req, action, target, targetId, details) => {
  if (!req.adminId) return;
  try {
    const admin = await Admin.findById(req.adminId);
    await AuditLog.create({
      adminId: req.adminId,
      adminUsername: admin ? (admin.fullName || admin.username) : 'Unknown',
      action,
      target,
      targetId,
      details
    });
  } catch (e) {
    console.error('Logging failed', e);
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

    // Create Notification for Admin
    await new Notification({
      type: 'registration',
      message: `Đăng ký mới: ${req.body.lastName} ${req.body.firstName} - ${req.body.courseName || req.body.course}`,
      relatedId: registration._id
    }).save();

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
app.put('/api/registrations/:id', protect, async (req, res) => {
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
    
    await logActivity(req, 'UPDATE', 'Registration', req.params.id, `Updated status/info`);
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
app.put('/api/products/:id', protect, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, upsert: true } // Tạo mới nếu chưa tồn tại
    );
    await logActivity(req, 'UPDATE', 'Product', req.params.id, `Updated product ${req.body.title}`);
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Create Product
app.post('/api/products', protect, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    await logActivity(req, 'CREATE', 'Product', newProduct.id, `Created product ${newProduct.title}`);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Delete Product
app.delete('/api/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', product ? product.title : 'Product', req.params.id, `Lý do: ${reason}`);
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
app.post('/api/news', protect, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    await logActivity(req, 'CREATE', 'News', news._id, `Created news: ${news.title}`);
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

// Update news
app.put('/api/news/:id', protect, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req, 'UPDATE', 'News', req.params.id, `Updated news: ${news.title}`);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

// Delete news
app.delete('/api/news/:id', protect, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', news ? news.title : 'News', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

// --- GALLERY ROUTES ---

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

// Add image to gallery
app.post('/api/gallery', protect, async (req, res) => {
  try {
    const newImage = new Gallery(req.body);
    await newImage.save();
    await logActivity(req, 'CREATE', 'Gallery', newImage._id, `Uploaded image: ${newImage.title}`);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Error adding image' });
  }
});

// Delete gallery image
app.delete('/api/gallery/:id', protect, async (req, res) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', img ? img.title || 'Hình ảnh' : 'Gallery', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// --- VIDEO ROUTES ---

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

// Add video
app.post('/api/videos', protect, async (req, res) => {
  try {
    const { url, title, description } = req.body;
    // Extract YouTube ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return res.status(400).json({ message: 'Link YouTube không hợp lệ' });

    const newVideo = new Video({ title, videoId, description });
    await newVideo.save();
    await logActivity(req, 'CREATE', 'Video', newVideo._id, `Added video: ${title}`);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video' });
  }
});

// Delete video
app.delete('/api/videos/:id', protect, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', video ? video.title : 'Video', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video' });
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
app.put('/api/settings', protect, async (req, res) => {
  try {
    // Cập nhật document đầu tiên tìm thấy hoặc tạo mới nếu chưa có (upsert logic thủ công để đảm bảo chỉ có 1 doc)
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings(req.body);
    else Object.assign(settings, req.body);
    
    await settings.save();
    await logActivity(req, 'UPDATE', 'Settings', 'General', 'Updated system settings');
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Route to delete a registration
app.delete('/api/registrations/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const reg = await Registration.findByIdAndDelete(id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', reg ? `${reg.lastName} ${reg.firstName}` : 'Học viên', id, `Lý do: ${reason}`);
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
  max: 30, // Tăng giới hạn IP để ưu tiên logic khóa tài khoản theo Username
  message: 'Bạn đã gửi quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    let admin = await Admin.findOne({ username });
    
    // Case 1: Admin exists in DB
    if (admin) {
      // 1. Kiểm tra xem tài khoản có đang bị khóa không
      if (admin.lockUntil && admin.lockUntil > Date.now()) {
        const waitMinutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
        let timeDisplay = `${waitMinutes} phút`;
        if (waitMinutes > 60) {
          const hours = Math.floor(waitMinutes / 60);
          const mins = waitMinutes % 60;
          timeDisplay = `${hours} giờ ${mins} phút`;
        }
        return res.status(403).json({ message: `Tài khoản đã bị khóa. Vui lòng thử lại sau ${timeDisplay}.` });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        // 2. Đăng nhập thành công -> Reset số lần sai và mở khóa (nếu có)
        if (admin.loginAttempts > 0 || admin.lockUntil || admin.lockoutCount > 0) {
          admin.loginAttempts = 0;
          admin.lockUntil = undefined;
          admin.lockoutCount = 0;
          await admin.save();
        }

        // --- 2FA: Generate Code & Send Email ---
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        admin.twoFactorCode = code;
        admin.twoFactorExpires = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút
        await admin.save();

        if (admin.email) {
          const subject = 'Mã xác thực đăng nhập (2FA)';
          const text = `Mã xác thực của bạn là: ${code}\nMã này sẽ hết hạn sau 5 phút.`;
          await transporter.sendMail({ from: process.env.EMAIL_USER, to: admin.email, subject, text });
        } else {
          console.log(`[2FA] Admin ${admin.username} chưa có email. Mã code: ${code}`);
        }

        return res.json({ require2FA: true, username: admin.username, message: 'Vui lòng nhập mã xác thực đã được gửi đến email.' });
      } else {
        // 3. Sai mật khẩu -> Tăng số lần sai
        admin.loginAttempts = (admin.loginAttempts || 0) + 1;
        
        // Nếu sai quá 5 lần -> Khóa 15 phút
        if (admin.loginAttempts >= 5) {
          admin.lockoutCount = (admin.lockoutCount || 0) + 1;
          
          let lockTime = 15 * 60 * 1000; // 15 phút
          let msg = 'Tài khoản đã bị khóa 15 phút do nhập sai quá 5 lần.';

          // Nếu đã bị khóa 1 lần trước đó (lockoutCount >= 2) -> Khóa 24h
          if (admin.lockoutCount >= 2) {
            lockTime = 24 * 60 * 60 * 1000; // 24 giờ
            msg = 'Tài khoản đã bị khóa 24 giờ do nhập sai liên tiếp nhiều lần.';
          }

          admin.lockUntil = Date.now() + lockTime;
          admin.loginAttempts = 0; // Reset số lần thử để bắt đầu chu kỳ mới sau khi hết khóa
          await admin.save();
          return res.status(403).json({ message: msg });
        }
        
        await admin.save();
        return res.status(401).json({ message: `Sai mật khẩu. Bạn còn ${5 - admin.loginAttempts} lần thử.` });
      }
    }
    
    // 2. Fallback: Kiểm tra biến môi trường (Chỉ dùng khi chưa có Admin trong DB)
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === envUser && password === envPass) {
      // Create the first admin in DB if it doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(envPass, salt);
      const newAdmin = await Admin.findOneAndUpdate(
        { username: envUser },
        { $setOnInsert: { username: envUser, password: hashedPassword, role: 'superadmin' } },
        { upsert: true, new: true }
      );
      console.log('[Auth] Created/Verified default admin account from .env');
      
      // --- 2FA for Fallback Account ---
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      newAdmin.twoFactorCode = code;
      newAdmin.twoFactorExpires = Date.now() + 5 * 60 * 1000;
      await newAdmin.save();

      if (newAdmin.email) {
         const subject = 'Mã xác thực đăng nhập (2FA)';
         const text = `Mã xác thực của bạn là: ${code}`;
         await transporter.sendMail({ from: process.env.EMAIL_USER, to: newAdmin.email, subject, text });
      } else {
         console.log(`[2FA] Fallback Admin chưa có email. Mã code: ${code}`);
      }

      return res.json({ require2FA: true, username: newAdmin.username, message: 'Vui lòng nhập mã xác thực.' });
    }
    
    // If nothing matches
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Verify 2FA Route
app.post('/api/verify-2fa', loginLimiter, async (req, res) => {
  const { username, code } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Tài khoản không tồn tại' });

    if (admin.twoFactorCode !== code || admin.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn' });
    }

    // Clear 2FA code
    admin.twoFactorCode = undefined;
    admin.twoFactorExpires = undefined;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi',
      { expiresIn: '1d' }
    );
    return res.json({ token, role: admin.role, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực' });
  }
});

// Change Password Route
app.post('/api/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Không tìm thấy tài khoản Admin.' });

    // Send email notification
    if (admin.email) {
      const subject = 'Thông báo thay đổi mật khẩu';
      const text = `Xin chào ${admin.fullName || admin.username},\n\nMật khẩu tài khoản quản trị của bạn vừa được thay đổi thành công.\nNếu bạn không thực hiện hành động này, vui lòng liên hệ ngay với quản trị viên cấp cao.\n\nTrân trọng,\nHệ thống quản lý.`;
      await sendEmail(subject, text);
      // Note: sendEmail currently sends to ADMIN_EMAIL from .env, you might want to update sendEmail to accept a 'to' address or create a new helper.
      // For now, assuming sendEmail is fixed or we use transporter directly here for specific user email.
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });

    // Mã hóa mật khẩu mới trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi đổi mật khẩu' });
  }
});

// Verify Token Route (AuthContext sẽ gọi API này khi reload trang)
app.get('/api/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi');
    
    // Fetch fresh data from DB
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'User not found' });

    res.json({ 
      username: admin.username, 
      role: admin.role,
      fullName: admin.fullName,
      email: admin.email,
      avatar: admin.avatar
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get Admin Profile
app.get('/api/admin/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Admin Profile
app.put('/api/admin/profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.adminId, req.body, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    // Send email notification
    if (admin.email) {
      const subject = 'Cập nhật hồ sơ thành công';
      const text = `Xin chào ${admin.fullName || admin.username},\n\nThông tin hồ sơ của bạn đã được cập nhật.\n\nTrân trọng,\nHệ thống quản lý.`;
      // Using transporter directly to send to the specific admin's email
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: admin.email, subject, text });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Server error on update' });
  }
});

// --- ADMIN MANAGEMENT ROUTES (SuperAdmin Only) ---

// Middleware check SuperAdmin
const checkSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (admin && admin.role === 'superadmin') {
      next();
    } else {
      res.status(403).json({ message: 'Yêu cầu quyền SuperAdmin' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực quyền hạn' });
  }
};

// Get all admins
app.get('/api/admins', protect, checkSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách admin' });
  }
});

// Create admin
app.post('/api/admins', protect, checkSuperAdmin, async (req, res) => {
  try {
    const { username, password, role, fullName, email } = req.body;
    
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: role || 'admin',
      fullName,
      email
    });

    await newAdmin.save();
    await logActivity(req, 'CREATE', 'Admin', newAdmin.username, `Created admin account: ${username}`);
    res.status(201).json({ message: 'Tạo tài khoản thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo tài khoản' });
  }
});

// Update admin (SuperAdmin only)
app.put('/api/admins/:id', protect, checkSuperAdmin, async (req, res) => {
  try {
    const { username, password, role, fullName, email } = req.body;
    const adminId = req.params.id;

    // Check if username exists (excluding current admin)
    if (username) {
      const exists = await Admin.findOne({ username, _id: { $ne: adminId } });
      if (exists) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const updateData = { username, role, fullName, email };

    // Only hash and update password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true }).select('-password');
    if (!updatedAdmin) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    // Send email notification
    if (updatedAdmin.email) {
      const subject = 'Tài khoản của bạn đã được cập nhật';
      const text = `Xin chào ${updatedAdmin.fullName || updatedAdmin.username},\n\nThông tin tài khoản của bạn đã được cập nhật bởi Superadmin.\n\nTrân trọng,\nHệ thống quản lý.`;
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: updatedAdmin.email, subject, text });
    }

    await logActivity(req, 'UPDATE', 'Admin', updatedAdmin.username, `Updated admin info: ${updatedAdmin.username}`);
    res.json({ message: 'Cập nhật thành công', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật tài khoản' });
  }
});

// Reset admin password (SuperAdmin only)
app.put('/api/admins/:id/reset-password', protect, checkSuperAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const admin = await Admin.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    if (!admin) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    // Send email notification
    if (admin.email) {
      const subject = 'Mật khẩu của bạn đã được đặt lại';
      const text = `Xin chào ${admin.fullName || admin.username},\n\nMật khẩu của bạn đã được đặt lại bởi Superadmin.\nVui lòng liên hệ Superadmin để nhận mật khẩu mới.\n\nTrân trọng,\nHệ thống quản lý.`;
      await transporter.sendMail({ from: process.env.EMAIL_USER, to: admin.email, subject, text });
    }

    await logActivity(req, 'UPDATE', 'Admin', admin.username, `Reset password for admin: ${admin.username}`);
    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi đặt lại mật khẩu' });
  }
});

// Unlock admin account (SuperAdmin only)
app.put('/api/admins/:id/unlock', protect, checkSuperAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, {
      loginAttempts: 0,
      lockoutCount: 0,
      $unset: { lockUntil: 1 } // Xóa trường lockUntil
    });
    if (!admin) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    await logActivity(req, 'UPDATE', 'Admin', admin.username, `Unlocked account: ${admin.username}`);
    res.json({ message: 'Mở khóa tài khoản thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi mở khóa tài khoản' });
  }
});

// Delete admin
app.delete('/api/admins/:id', protect, checkSuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.adminId) {
      return res.status(400).json({ message: 'Không thể tự xóa chính mình' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', admin ? admin.username : 'Admin', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa tài khoản' });
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

    // Create Notification for Admin
    await new Notification({
      type: 'contact',
      message: `Tư vấn mới: ${req.body.fullname} - ${req.body.phone}`,
      relatedId: contact._id
    }).save();

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
app.put('/api/contacts/:id', protect, async (req, res) => {
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
    await logActivity(req, 'UPDATE', 'Contact', id, `Updated contact status`);
    res.status(200).json(c);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contact' });
  }
});

// Route to delete a contact
app.delete('/api/contacts/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', contact ? contact.fullname : 'Liên hệ', id, `Lý do: ${reason}`);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

// --- NOTIFICATION ROUTES ---

// Get notifications
app.get('/api/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// --- AUDIT LOG ROUTES ---
app.get('/api/audit-logs', protect, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});