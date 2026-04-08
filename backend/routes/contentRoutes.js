const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const cloudinary = require('cloudinary').v2;
const { logActivity } = require('../utils/helpers');

const Product = require('../models/Product');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Video = require('../models/Video');
const Banner = require('../models/Banner');

// --- Hàm Helper: Xóa file trên Cloudinary ---
const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes('cloudinary.com')) return;
    
    // Phân tích URL để lấy public_id
    const urlParts = fileUrl.split('/');
    const uploadIndex = urlParts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return;
    
    const pathParts = urlParts.slice(uploadIndex + 2); // Bỏ qua phần 'upload' và 'v12345678'
    const fileWithExt = pathParts.join('/');
    
    const extIndex = fileWithExt.lastIndexOf('.');
    const publicId = extIndex !== -1 ? fileWithExt.substring(0, extIndex) : fileWithExt;
    
    // Xác định loại file để xóa đúng (video, raw, image)
    let resourceType = 'image';
    if (fileUrl.match(/\.(mp4|webm|mov|ogg)$/i)) resourceType = 'video';
    else if (fileUrl.match(/\.(pdf|doc|docx)$/i)) resourceType = 'raw';

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Lỗi xóa file Cloudinary:', err);
  }
};

// --- PRODUCT ROUTES ---
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

router.put('/products/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    // Xóa ảnh cũ trên Cloudinary nếu có ảnh mới được cập nhật
    const existingProduct = await Product.findOne({ id: req.params.id });
    if (existingProduct && existingProduct.image && req.body.image && existingProduct.image !== req.body.image) {
      await deleteFromCloudinary(existingProduct.image);
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, upsert: true }
    );
    try { await logActivity(req, 'UPDATE', 'Product', updatedProduct._id, `Updated product ${req.body.title}`); } catch(e){}
    res.json(updatedProduct);
  } catch (error) {
    console.error('Lỗi khi cập nhật khóa học:', error);
    res.status(500).json({ message: error.message || 'Lỗi hệ thống khi cập nhật khóa học' });
  }
});

router.post('/products', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    // Kiểm tra mã ID đã tồn tại chưa để báo lỗi rõ ràng
    const existing = await Product.findOne({ id: req.body.id });
    if (existing) {
      return res.status(400).json({ message: 'Mã khóa học (ID) đã tồn tại! Vui lòng chọn mã khác.' });
    }
    
    const newProduct = new Product(req.body);
    await newProduct.save();
    try { await logActivity(req, 'CREATE', 'Product', newProduct._id, `Created product ${newProduct.title}`); } catch(e){}
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Lỗi khi tạo khóa học:', error);
    res.status(500).json({ message: error.message || 'Lỗi hệ thống khi tạo khóa học' });
  }
});

router.delete('/products/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (product && product.image) {
      await deleteFromCloudinary(product.image); // Xoá ảnh trên Cloudinary
    }
    const reason = req.body.reason || 'Không có lý do';
    try { await logActivity(req, 'DELETE', product ? product.title : 'Product', product ? product._id : null, `Lý do: ${reason}`); } catch(e){}
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Lỗi khi xóa khóa học:', error);
    res.status(500).json({ message: error.message || 'Lỗi hệ thống khi xóa khóa học' });
  }
});

// --- NEWS ROUTES ---
router.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news detail' });
  }
});

router.post('/news', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    await logActivity(req, 'CREATE', 'News', news._id, `Created news: ${news.title}`);
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

router.put('/news/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    // Xóa ảnh cũ trên Cloudinary nếu có ảnh mới
    const existingNews = await News.findById(req.params.id);
    if (existingNews && existingNews.image && req.body.image && existingNews.image !== req.body.image) {
      await deleteFromCloudinary(existingNews.image);
    }
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req, 'UPDATE', 'News', req.params.id, `Updated news: ${news.title}`);
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

router.delete('/news/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (news && news.image) {
      await deleteFromCloudinary(news.image); // Xoá ảnh trên Cloudinary
    }
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', news ? news.title : 'News', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

// --- GALLERY ROUTES ---
router.get('/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

router.post('/gallery', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const newImage = new Gallery(req.body);
    await newImage.save();
    await logActivity(req, 'CREATE', 'Gallery', newImage._id, `Uploaded image: ${newImage.title}`);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Error adding image' });
  }
});

router.delete('/gallery/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    if (img && img.image) {
      await deleteFromCloudinary(img.image); // Xoá ảnh trên Cloudinary
    }
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', img ? img.title || 'Hình ảnh' : 'Gallery', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image' });
  }
});

// --- VIDEO ROUTES ---
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

router.post('/videos', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const { url, title, description } = req.body;

    if (!url) return res.status(400).json({ message: 'Thiếu đường dẫn video' });

    // Dùng lại trường videoId để lưu đường dẫn file video để không phải sửa Database Schema
    const newVideo = new Video({ title, videoId: url, description });
    await newVideo.save();
    await logActivity(req, 'CREATE', 'Video', newVideo._id, `Added video: ${title}`);
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video' });
  }
});

router.delete('/videos/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (video && video.videoId) {
      await deleteFromCloudinary(video.videoId); // Xóa file video trên Cloudinary
    }
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', video ? video.title : 'Video', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video' });
  }
});

// --- BANNER ROUTES ---
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners' });
  }
});

router.post('/banners', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    await newBanner.save();
    await logActivity(req, 'CREATE', 'Banner', newBanner._id, `Added banner: ${newBanner.title}`);
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error adding banner' });
  }
});

router.put('/banners/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    // Xóa ảnh cũ trên Cloudinary nếu bị thay thế
    const existingBanner = await Banner.findById(req.params.id);
    if (existingBanner && existingBanner.image && req.body.image && existingBanner.image !== req.body.image) {
      await deleteFromCloudinary(existingBanner.image);
    }
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req, 'UPDATE', 'Banner', req.params.id, `Updated banner: ${banner.title}`);
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner' });
  }
});

router.delete('/banners/:id', protect, checkPermission(PERMISSIONS.MANAGE_CONTENT), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (banner && banner.image) {
      await deleteFromCloudinary(banner.image); // Xoá ảnh trên Cloudinary
    }
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', banner ? banner.title || 'Banner' : 'Banner', req.params.id, `Lý do: ${reason}`);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner' });
  }
});

module.exports = router;