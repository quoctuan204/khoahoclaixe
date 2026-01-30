const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const { protect, checkSuperAdmin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Bạn đã gửi quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.'
});

// Helper log
const logActivity = async (req, action, target, targetId, details) => {
  if (!req.adminId) return;
  try {
    const admin = await Admin.findById(req.adminId);
    await AuditLog.create({
      adminId: req.adminId,
      adminUsername: admin ? (admin.fullName || admin.username) : 'Unknown',
      action, target, targetId, details
    });
  } catch (e) { console.error('Logging failed', e); }
};

// --- ROUTES ---

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({ username });
    
    if (admin) {
      if (admin.lockUntil && admin.lockUntil > Date.now()) {
        return res.status(403).json({ message: `Tài khoản bị khóa.` });
      }

      if (!admin.password) {
        return res.status(500).json({ message: 'Lỗi dữ liệu: Tài khoản không có mật khẩu.' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        admin.lockoutCount = 0;
        
        await admin.save();

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return res.json({ token, role: admin.role, username: admin.username });
      } else {
        admin.loginAttempts = (admin.loginAttempts || 0) + 1;
        if (admin.loginAttempts >= 5) {
          admin.lockUntil = Date.now() + 15 * 60 * 1000;
          return res.status(403).json({ message: 'Tài khoản bị khóa 15 phút.' });
        }
        await admin.save();
        return res.status(401).json({ message: 'Sai mật khẩu.' });
      }
    }
    return res.status(401).json({ message: 'Sai thông tin đăng nhập' });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

router.post('/verify-2fa', loginLimiter, async (req, res) => {
  const { username, code } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.twoFactorCode !== code || admin.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: 'Mã không hợp lệ' });
    }
    admin.twoFactorCode = undefined;
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, role: admin.role, username: admin.username });
  } catch (error) {
    console.error('2FA Verify Error:', error);
    res.status(500).json({ message: 'Lỗi xác thực' });
  }
});

router.get('/me', async (req, res) => {
  console.log('[DEBUG] GET /api/me - Bắt đầu xử lý');
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('[DEBUG] Không tìm thấy Token');
      return res.status(401).json({ message: 'No token' });
    }
    
    console.log('[DEBUG] Đang verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('[DEBUG] Token OK. ID:', decoded.id, '- Đang tìm trong DB...');

    const admin = await Admin.findById(decoded.id).select('-password');
    console.log('[DEBUG] Kết quả DB:', admin ? 'Tìm thấy' : 'Không tìm thấy');

    if (!admin) return res.status(404).json({ message: 'User not found' });
    res.json(admin);
  } catch (error) {
    console.error('👉 [DEBUG] Lỗi tại /api/me:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// --- ADMIN MANAGEMENT (SuperAdmin) ---

router.get('/admins', protect, checkSuperAdmin, async (req, res) => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  res.json(admins);
});

router.post('/admins', protect, checkSuperAdmin, async (req, res) => {
  const { username, password, role, fullName, email } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ message: 'Username tồn tại' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newAdmin = new Admin({ username, password: hashedPassword, role, fullName, email });
  await newAdmin.save();
  
  await logActivity(req, 'CREATE', 'Admin', newAdmin.username, `Created: ${username}`);
  res.status(201).json({ message: 'Tạo thành công' });
});

router.put('/admins/:id', protect, checkSuperAdmin, async (req, res) => {
  const { username, password, role, fullName, email } = req.body;
  const updateData = { username, role, fullName, email };
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }
  const updated = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
  await logActivity(req, 'UPDATE', 'Admin', updated.username, `Updated info`);
  res.json({ message: 'Cập nhật thành công', admin: updated });
});

router.delete('/admins/:id', protect, checkSuperAdmin, async (req, res) => {
  if (req.params.id === req.adminId) return res.status(400).json({ message: 'Không thể tự xóa' });
  await Admin.findByIdAndDelete(req.params.id);
  await logActivity(req, 'DELETE', 'Admin', req.params.id, 'Deleted admin');
  res.json({ message: 'Xóa thành công' });
});

router.put('/admins/:id/unlock', protect, checkSuperAdmin, async (req, res) => {
  await Admin.findByIdAndUpdate(req.params.id, { loginAttempts: 0, lockoutCount: 0, $unset: { lockUntil: 1 } });
  res.json({ message: 'Mở khóa thành công' });
});

router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.adminId);
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Mật khẩu cũ sai' });
  
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();
  res.json({ message: 'Đổi mật khẩu thành công' });
});

router.get('/admin/profile', protect, async (req, res) => {
  const admin = await Admin.findById(req.adminId).select('-password');
  res.json(admin);
});

router.put('/admin/profile', protect, async (req, res) => {
  let { fullName, email, avatar } = req.body;
  if (email) email = email.trim(); // Xóa khoảng trắng thừa

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Địa chỉ email không đúng định dạng' });
  }

  const admin = await Admin.findByIdAndUpdate(req.adminId, { fullName, email, avatar }, { new: true }).select('-password');
  res.json(admin);
});

/* FORGOT PASSWORD */
router.post('/forgot-password', loginLimiter, async (req, res) => {
  let { email } = req.body;
  if (email) email = email.trim(); // Xóa khoảng trắng thừa
  console.log('[DEBUG] Yêu cầu quên mật khẩu cho email:', email);
  try {
    // Tìm kiếm chính xác nhưng không phân biệt hoa thường (Case-insensitive)
    const admin = await Admin.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!admin) return res.status(400).json({ message: 'Email không tồn tại trong hệ thống' });

    // --- RATE LIMIT: Max 3 lần / 1 giờ ---
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    if (!admin.resetRequestWindowStart || (now - admin.resetRequestWindowStart > ONE_HOUR)) {
      admin.resetRequestCount = 0;
      admin.resetRequestWindowStart = now;
    }

    if (admin.resetRequestCount >= 3) {
      const minutesLeft = Math.ceil((admin.resetRequestWindowStart.getTime() + ONE_HOUR - now) / 60000);
      return res.status(429).json({ message: `Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau ${minutesLeft} phút.` });
    }
    admin.resetRequestCount = (admin.resetRequestCount || 0) + 1;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordCode = code;
    admin.resetPasswordExpires = Date.now() + 1 * 60 * 1000; // Hết hạn sau 1 phút
    await admin.save();

    await sendEmail(admin.email, 'Mã đặt lại mật khẩu', `Mã xác nhận của bạn là: ${code}`);
    res.json({ message: 'Đã gửi mã xác nhận vào email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi gửi email' });
  }
});

router.post('/reset-password-public', loginLimiter, async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ 
      email, 
      resetPasswordCode: code, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!admin) return res.status(400).json({ message: 'Mã xác nhận không đúng hoặc đã hết hạn' });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.resetPasswordCode = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;