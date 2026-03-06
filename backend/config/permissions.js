// Danh sách các quyền cụ thể
const PERMISSIONS = {
  // Content (Sản phẩm, Tin tức, Banner...)
  MANAGE_CONTENT: 'manage_content', // Thêm, sửa, xóa nội dung
  
  // Customer (Học viên, Liên hệ)
  VIEW_CUSTOMERS: 'view_customers', // Xem danh sách
  MANAGE_CUSTOMERS: 'manage_customers', // Sửa trạng thái, xóa
  
  // System (Cài đặt, Logs, Tài khoản Admin)
  MANAGE_SYSTEM: 'manage_system',
};

// Định nghĩa Role được làm những gì
const ROLE_PERMISSIONS = {
  superadmin: ['*'], // Full quyền
  admin: [
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.MANAGE_CUSTOMERS,
    PERMISSIONS.MANAGE_SYSTEM
  ],
  editor: [
    PERMISSIONS.MANAGE_CONTENT
  ],
  sale: [
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.MANAGE_CUSTOMERS
  ],
  staff: [ // Map staff giống editor hoặc tùy chỉnh
    PERMISSIONS.MANAGE_CONTENT
  ]
};

module.exports = { PERMISSIONS, ROLE_PERMISSIONS };
