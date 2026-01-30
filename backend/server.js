const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

dotenv.config();

const app = express();

// --- IMPORTS TỪ CẤU TRÚC MỚI ---
const { encrypt, decrypt } = require('./utils/encryption');
const { protect } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const sendEmailUtil = require('./utils/sendEmail');

// 1. SECURITY: Helmet (Bảo mật Headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. SECURITY: CORS (Chỉ cho phép Frontend gọi API)
app.use(cors({
  origin: (origin, callback) => {
    // Cho phép request không có origin (như mobile app, curl) hoặc từ localhost
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Request Logger (Giúp debug xem request có đến được server không)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

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

// Filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif)!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload Route
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file' });
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected successfully'))
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
const Banner = require('./models/Banner');

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
      AuditLog,
      Banner
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

// 3. SECURITY: Rate Limiting (Chống Spam/DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 request mỗi IP
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
});
app.use('/api/', limiter);

// --- MOUNT ROUTES ---
app.use('/api', authRoutes); // Mount Auth Routes

// Function to send email
const sendEmail = async (subject, text) => {
  try {
    await sendEmailUtil('nguyentuann29t12@gmail.com', subject, text);
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

// --- BANNER ROUTES ---

// Get all banners
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners' });
  }
});

// Create banner
app.post('/api/banners', protect, async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    await newBanner.save();
    await logActivity(req, 'CREATE', 'Banner', newBanner._id, `Created banner: ${newBanner.title}`);
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner' });
  }
});

// Delete banner
app.delete('/api/banners/:id', protect, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    await logActivity(req, 'DELETE', 'Banner', req.params.id, 'Deleted banner');
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner' });
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

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi server', error: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Cổng ${PORT} đang bị chiếm dụng! Hãy tắt server cũ hoặc đổi cổng.`);
  }
});