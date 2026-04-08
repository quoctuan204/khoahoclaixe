// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cấu hình thông tin kết nối
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình nơi lưu trữ (Storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Tự động phân loại định dạng file để Cloudinary xử lý đúng
    let resource_type = 'auto';
    if (file.mimetype.startsWith('video/')) {
        resource_type = 'video';
    } else if (file.mimetype.startsWith('image/')) {
        resource_type = 'image';
    } else {
        resource_type = 'raw'; // Phù hợp cho các file tài liệu pdf, docx...
    }

    return {
      folder: 'khoahoclaixe_uploads', // Tên thư mục sẽ tạo trên Cloudinary
      resource_type: resource_type,
      // Cho phép các định dạng sau:
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'pdf', 'doc', 'docx']
    };
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;