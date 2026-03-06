require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
// const Admin = require('../models/Admin'); // Tạm tắt Model Admin để tránh lỗi Schema Validation
const Role = require('../models/Role');
const { PERMISSIONS } = require('../config/permissions');

// --- Cấu hình các vai trò mặc định và quyền hạn của chúng ---
const defaultRoles = {
  superadmin: {
    description: 'Quản trị viên cao nhất, có toàn bộ quyền.',
    permissions: ['*'],
  },
  admin: {
    description: 'Quản trị viên, có hầu hết các quyền quản lý.',
    permissions: [
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.VIEW_CUSTOMERS,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_SYSTEM,
    ],
  },
  editor: {
    description: 'Biên tập viên, chỉ có quyền quản lý nội dung (tin tức, sản phẩm...).',
    permissions: [PERMISSIONS.MANAGE_CONTENT],
  },
  sale: {
    description: 'Nhân viên kinh doanh, quản lý thông tin khách hàng và đăng ký.',
    permissions: [PERMISSIONS.VIEW_CUSTOMERS, PERMISSIONS.MANAGE_CUSTOMERS],
  },
  // 'staff' là role cũ, ta sẽ map nó sang 'editor'
  staff: {
    description: 'Biên tập viên, chỉ có quyền quản lý nội dung (tin tức, sản phẩm...).',
    permissions: [PERMISSIONS.MANAGE_CONTENT],
  }
};

const migrate = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Lỗi: Biến môi trường MONGO_URI chưa được thiết lập trong file .env');
    process.exit(1);
  }

  try {
    // 1. Kết nối tới Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công.');

    // 2. Tạo hoặc tìm các Role mặc định và lấy ID của chúng
    const roleMap = {};
    console.log('\n--- Bước 1: Tạo các vai trò (Roles) ---');
    for (const roleName in defaultRoles) {
      const roleData = defaultRoles[roleName];
      let role = await Role.findOneAndUpdate(
        { name: roleName },
        { $setOnInsert: { name: roleName, description: roleData.description, permissions: roleData.permissions } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`- Đã xử lý vai trò: '${roleName}'`);
      roleMap[roleName] = role._id;
    }
    // Xử lý trường hợp role 'staff' cũ được map sang 'editor'
    if (roleMap.editor) {
        roleMap.staff = roleMap.editor;
    }

    // 3. Chuyển đổi dữ liệu cho các Admin
    console.log('\n--- Bước 2: Chuyển đổi tài khoản Admin ---');
    
    // FIX: Sử dụng native driver để lấy dữ liệu thô, tránh bị Mongoose chặn do sai kiểu dữ liệu
    const adminsToMigrate = await mongoose.connection.db.collection('admins').find({ role: { $type: 'string' } }).toArray();

    if (adminsToMigrate.length === 0) {
      console.log('✅ Không có tài khoản Admin nào cần chuyển đổi.');
      return;
    }

    console.log(`🔍 Tìm thấy ${adminsToMigrate.length} tài khoản cần chuyển đổi...`);
    for (const admin of adminsToMigrate) {
      const oldRoleName = admin.role; // Đây là string, ví dụ: 'admin'
      const newRoleId = roleMap[oldRoleName];
      if (newRoleId) {
        // Update trực tiếp vào database
        await mongoose.connection.db.collection('admins').updateOne({ _id: admin._id }, { $set: { role: newRoleId } });
        console.log(`  -> Đã chuyển đổi tài khoản '${admin.username}' (role: "${oldRoleName}")`);
      }
    }
    console.log(`\n✅ Hoàn thành!`);
  } catch (error) {
    console.error('\n❌ Đã xảy ra lỗi trong quá trình chuyển đổi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB.');
  }
};

migrate();