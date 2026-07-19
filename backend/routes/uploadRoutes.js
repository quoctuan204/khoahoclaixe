const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const uploadCloud = require('../config/cloudinary');

// --- TEST UPLOAD MULTER MEMORY ---
const multer = require('multer');
const multerMemory = multer({ storage: multer.memoryStorage() });
router.post('/test-upload', multerMemory.single('image'), (req, res) => {
    console.log('==== [TEST UPLOAD] req.file:', req.file);
    if (!req.file) return res.status(400).json({ message: 'Không nhận được file (test)' });
    res.json({ message: 'Nhận file thành công (test)', originalname: req.file.originalname, size: req.file.size });
});

// Upload Route for Images
// SECURITY: Added 'protect' middleware to prevent unauthorized uploads
router.post('/upload', protect, (req, res) => {
    uploadCloud.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file' });
        if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
        // Trả về trực tiếp URL từ Cloudinary
        res.json({ imageUrl: req.file.path });
    });
});

// Upload Route for Videos
router.post('/upload-video', protect, (req, res) => {
    uploadCloud.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file video' });
        if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
        res.json({ videoUrl: req.file.path, fileName: req.file.originalname });
    });
});

// Upload Route for Documents (PDF, DOCX)
router.post('/upload-doc', protect, (req, res) => {
    uploadCloud.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message || 'Lỗi upload file' });
        if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
        res.json({ fileUrl: req.file.path, fileName: req.file.originalname });
    });
});

module.exports = router;