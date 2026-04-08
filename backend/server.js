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
const { protect } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const systemRoutes = require('./routes/systemRoutes');
const chatRoutes = require('./routes/chatRoutes');

// 1. SECURITY: Helmet (Bảo mật Headers)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. SECURITY: CORS (Chỉ cho phép Frontend gọi API)
app.use(cors({
  origin: (origin, callback) => {
    // Tạm thời cho phép TẤT CẢ các domain gọi API để không bị lỗi CORS khi deploy Frontend lên Render/Vercel/Netlify.
    // (Để bảo mật hơn sau này, bạn có thể kiểm tra danh sách domain tĩnh tại đây)
    callback(null, true);
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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadCloud = require('./config/cloudinary');

// Upload Route
// SECURITY: Added 'protect' middleware to prevent unauthorized uploads
app.post('/api/upload', protect, (req, res) => {
  uploadCloud.single('image')(req, res, (err) => {
    if (err) console.log("UPLOAD ERROR:", err.message);
    if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file' });
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
    
    // Trả về trực tiếp URL từ Cloudinary
    res.json({ imageUrl: req.file.path });
  });
});

// --- UPLOAD VIDEO ---
app.post('/api/upload-video', protect, (req, res) => {
  uploadCloud.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file video' });
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
    
    res.json({ videoUrl: req.file.path, fileName: req.file.originalname });
  });
});

// --- UPLOAD TÀI LIỆU (PDF, DOCX) ---
app.post('/api/upload-doc', protect, (req, res) => {
  uploadCloud.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file' });
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
    
    res.json({ fileUrl: req.file.path, fileName: req.file.originalname });
  });
});

// --- API QUẢN LÝ BIỂU MẪU ---
const FormDocSchema = new mongoose.Schema({ form1Url: String, form1Name: String, form2Url: String, form2Name: String });
const FormDoc = mongoose.models.FormDoc || mongoose.model('FormDoc', FormDocSchema);

app.get('/api/forms', async (req, res) => res.json((await FormDoc.findOne()) || {}));
app.post('/api/forms', protect, async (req, res) => {
  res.json(await FormDoc.findOneAndUpdate({}, req.body, { upsert: true, new: true }));
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
app.use('/api', contentRoutes); // Mount Content Routes (Products, News, etc.)
app.use('/api', customerRoutes); // Mount Customer Routes (Registration, Contact)
app.use('/api', systemRoutes); // Mount System Routes (Settings, Logs)
app.use('/api/chat', chatRoutes); // Mount Chatbot Routes

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
