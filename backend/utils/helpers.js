const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
// Giả định bạn đã có file sendEmail.js từ trước, nếu chưa có hãy tạo nó
const sendEmailUtil = require('./sendEmail'); 

// Helper log hoạt động của Admin
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

// Hàm gửi email bọc ngoài
const sendEmail = async (subject, text) => {
  try {
    // Thay email nhận bằng email của admin
    await sendEmailUtil('nguyentuann29t12@gmail.com', subject, text);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Validate số điện thoại Việt Nam
const isValidPhoneNumber = (phone) => {
  return /^(03|05|07|08|09)\d{8}$/.test(phone);
};

// Validate Email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = {
  logActivity,
  sendEmail,
  isValidPhoneNumber,
  isValidEmail
};