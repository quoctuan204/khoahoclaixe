const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { logActivity } = require('../utils/helpers');

const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// --- SETTINGS ROUTES ---
router.get('/settings', async (req, res) => {
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

router.put('/settings', protect, checkPermission(PERMISSIONS.MANAGE_SYSTEM), async (req, res) => {
  try {
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

// --- NOTIFICATION ROUTES ---
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// --- AUDIT LOG ROUTES ---
// Chỉ Admin/SuperAdmin mới xem được log hệ thống
router.get('/audit-logs', protect, checkPermission(PERMISSIONS.MANAGE_SYSTEM), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

module.exports = router;