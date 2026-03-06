const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { PERMISSIONS } = require('../config/permissions');
const { protect, checkSuperAdmin } = require('../middleware/authMiddleware');

// Chỉ Super Admin mới được quản lý roles
router.use(protect, checkSuperAdmin);

// Lấy danh sách tất cả các quyền có thể có trong hệ thống
router.get('/permissions', (req, res) => {
  res.json(Object.values(PERMISSIONS));
});

// Lấy tất cả roles
router.get('/roles', async (req, res) => {
  const roles = await Role.find().sort({ name: 1 });
  res.json(roles);
});

// Tạo role mới
router.post('/roles', async (req, res) => {
  const { name, description, permissions } = req.body;
  if (!name) return res.status(400).json({ message: 'Tên vai trò là bắt buộc' });

  const newRole = new Role({ name, description, permissions });
  await newRole.save();
  res.status(201).json(newRole);
});

// Cập nhật role
router.put('/roles/:id', async (req, res) => {
  const { name, description, permissions } = req.body;
  const updatedRole = await Role.findByIdAndUpdate(
    req.params.id,
    { name, description, permissions },
    { new: true }
  );
  res.json(updatedRole);
});

// Xóa role
router.delete('/roles/:id', async (req, res) => {
  // TODO: Thêm logic kiểm tra xem có admin nào đang dùng role này không trước khi xóa
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: 'Xóa vai trò thành công' });
});

module.exports = router;
