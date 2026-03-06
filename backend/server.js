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
  // SECURITY: Whitelist extensions to prevent executable/script uploads
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp)!'), false);
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
// SECURITY: Added 'protect' middleware to prevent unauthorized uploads
app.post('/api/upload', protect, (req, res) => {
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
app.use('/api', contentRoutes); // Mount Content Routes (Products, News, etc.)
app.use('/api', customerRoutes); // Mount Customer Routes (Registration, Contact)
app.use('/api', systemRoutes); // Mount System Routes (Settings, Logs)

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
