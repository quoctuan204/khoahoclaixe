// d:\Workspace\khoaHocLaiXe\backend\middleware\authMiddleware.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { ROLE_PERMISSIONS } = require('../config/permissions');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Lấy thông tin admin từ DB để đảm bảo role luôn mới nhất
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        return res.status(401).json({ message: 'Không tìm thấy tài khoản' });
      }

      if (admin.lockUntil && admin.lockUntil > Date.now()) {
        return res.status(403).json({ message: 'Tài khoản đang bị khóa' });
      }

      req.adminId = admin._id;
      req.role = admin.role; // Gán role string
      req.user = admin;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  } else {
    res.status(401).json({ message: 'Không có token xác thực' });
  }
};

// Middleware kiểm tra quyền hạn chi tiết
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.role;
    
    // Nếu không có role hoặc role không tồn tại trong config
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này (Role Invalid)' });
    }

    const allowedPermissions = ROLE_PERMISSIONS[userRole];

    // Superadmin có quyền '*' (tất cả)
    if (allowedPermissions.includes('*')) {
      return next();
    }

    // Kiểm tra quyền cụ thể
    if (allowedPermissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  };
};

// Middleware cũ (giữ lại để tương thích nếu cần, nhưng nên chuyển sang checkPermission)
const checkSuperAdmin = (req, res, next) => {
  if (req.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền Super Admin' });
  }
};

module.exports = { protect, checkPermission, checkSuperAdmin };
