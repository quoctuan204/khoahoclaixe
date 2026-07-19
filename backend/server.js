const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

dotenv.config();

// Ensure critical environment variables are set before starting the server
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the environment.");
  process.exit(1);
}
if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
  console.error("FATAL ERROR: ENCRYPTION_KEY is not defined or is too short (must be at least 32 characters).");
  process.exit(1);
}


const app = express();

// --- IMPORTS TỪ CẤU TRÚC MỚI ---
const { protect } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const systemRoutes = require('./routes/systemRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// 1. SECURITY: Helmet (Bảo mật Headers)
app.use(helmet({
  contentSecurityPolicy: false,
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

// --- CẢI TIẾN LOGIC SAO LƯU ---
const performBackup = async () => {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]; // Format: YYYY-MM-DDTHH-mm-ss
  const currentBackupDir = path.join(backupDir, timestamp);
  const RETENTION_DAYS = 7; // Giữ lại backup trong 7 ngày

  console.log(`[Backup] Starting daily backup...`);

  try {
    // 1. Thực hiện sao lưu
    fs.mkdirSync(currentBackupDir, { recursive: true });

    // Lấy danh sách model tự động từ Mongoose, không cần hardcode
    const models = mongoose.connection.models;

    for (const modelName in models) {
      try {
        const model = models[modelName];
        const data = await model.find({}).lean(); // .lean() để nhanh hơn
        const filePath = path.join(currentBackupDir, `${modelName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      } catch (modelError) {
        console.error(`[Backup] Failed to back up model ${modelName}:`, modelError);
        // Ghi nhận lỗi nhưng vẫn tiếp tục với các model khác
      }
    }
    console.log(`[Backup] Completed successfully to: ${currentBackupDir}`);

    // 2. Dọn dẹp các bản sao lưu cũ
    const allBackups = fs.readdirSync(backupDir).sort().reverse(); // Sắp xếp từ mới đến cũ
    if (allBackups.length > RETENTION_DAYS) {
      const backupsToDelete = allBackups.slice(RETENTION_DAYS);
      console.log(`[Backup] Cleaning up ${backupsToDelete.length} old backup(s)...`);
      for (const oldBackup of backupsToDelete) {
        try {
          const oldBackupPath = path.join(backupDir, oldBackup);
          fs.rmSync(oldBackupPath, { recursive: true, force: true });
          console.log(`  - Deleted: ${oldBackup}`);
        } catch (cleanupError) {
          console.error(`[Backup] Failed to delete old backup ${oldBackup}:`, cleanupError);
        }
      }
    }
  } catch (error) {
    console.error('[Backup] Failed:', error);
    // Nếu việc tạo thư mục backup chính bị lỗi, xóa nó đi để tránh thư mục rỗng
    if (fs.existsSync(currentBackupDir) && fs.readdirSync(currentBackupDir).length === 0) {
      fs.rmdirSync(currentBackupDir);
    }
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

// 4. SECURITY: Rate Limiting riêng cho Chatbot (chặt chẽ hơn)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 30, // Tối đa 30 tin nhắn mỗi phút cho một IP
  message: { reply: 'Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một lát rồi thử lại.' },
  standardHeaders: true, // Gửi header RateLimit-*
  legacyHeaders: false, // Tắt header X-RateLimit-*
});

// --- MOUNT ROUTES ---
app.use('/api', authRoutes); // Mount Auth Routes
app.use('/api', contentRoutes); // Mount Content Routes (Products, News, etc.)
app.use('/api', customerRoutes); // Mount Customer Routes (Registration, Contact)
app.use('/api', systemRoutes); // Mount System Routes (Settings, Logs)
app.use('/api', uploadRoutes); // Mount Upload Routes

// Áp dụng rate limit riêng cho chatbot
app.use('/api/chat', chatLimiter, chatRoutes);

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
