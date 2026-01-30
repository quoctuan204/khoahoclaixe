const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_an_toan_tuyet_doi');
      req.adminId = decoded.id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const checkSuperAdmin = async (req, res, next) => {
  const admin = await Admin.findById(req.adminId);
  if (admin && admin.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Yêu cầu quyền SuperAdmin' });
  }
};

module.exports = { protect, checkSuperAdmin };