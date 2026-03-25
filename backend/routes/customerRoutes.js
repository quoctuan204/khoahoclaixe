const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { encrypt, decrypt } = require('../utils/encryption');
const { logActivity, sendEmail, isValidPhoneNumber, isValidEmail } = require('../utils/helpers');

const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// --- REGISTRATION ROUTES ---
router.post('/register-course', async (req, res) => {
  try {
    if (!req.body.phone || !isValidPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ (10 số, đầu 03/05/07/08/09)' });
    }

    if (!req.body.email || !isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Địa chỉ Email không hợp lệ' });
    }

    const dbData = { ...req.body };
    if (dbData.phone) dbData.phone = encrypt(dbData.phone);
    if (dbData.cccd) dbData.cccd = encrypt(dbData.cccd);

    const registration = new Registration(dbData);
    await registration.save();

    await new Notification({
      type: 'registration',
      message: `Đăng ký mới: ${req.body.lastName} ${req.body.firstName} - ${req.body.courseName || req.body.course}`,
      relatedId: registration._id
    }).save();

    const { firstName, lastName, phone, email, course, courseName, cccd, address, note } = req.body; 

    const subject = 'Đăng ký khóa học mới';
    const text = `
      Đăng ký khóa học: ${courseName || course}
      Họ: ${lastName}
      Tên: ${firstName}
      SĐT: ${phone}
      Email: ${email}
      CCCD: ${cccd || 'N/A'}
      Địa chỉ: ${address || 'N/A'}
      Ghi chú: ${note || 'N/A'}
    `;

    await sendEmail(subject, text);

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving registration' });
  }
});

// Chỉ những người có quyền VIEW_CUSTOMERS mới xem được danh sách
router.get('/registrations', protect, checkPermission(PERMISSIONS.VIEW_CUSTOMERS), async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ _id: -1 });
    const decryptedRegistrations = registrations.map(reg => {
      const r = reg.toObject();
      if (r.phone) r.phone = decrypt(r.phone);
      if (r.cccd) r.cccd = decrypt(r.cccd);
      return r;
    });
    res.status(200).json(decryptedRegistrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

router.get('/registrations/:id', protect, checkPermission(PERMISSIONS.VIEW_CUSTOMERS), async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    const r = registration.toObject();
    if (r.phone) r.phone = decrypt(r.phone);
    if (r.cccd) r.cccd = decrypt(r.cccd);
    res.json(r);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registration' });
  }
});

// Chỉ những người có quyền MANAGE_CUSTOMERS mới được sửa
router.put('/registrations/:id', protect, checkPermission(PERMISSIONS.MANAGE_CUSTOMERS), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.phone) updateData.phone = encrypt(updateData.phone);
    if (updateData.cccd) updateData.cccd = encrypt(updateData.cccd);

    const updatedRegistration = await Registration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    const r = updatedRegistration.toObject();
    if (r.phone) r.phone = decrypt(r.phone);
    if (r.cccd) r.cccd = decrypt(r.cccd);
    
    await logActivity(req, 'UPDATE', 'Registration', req.params.id, `Updated status/info`);
    res.json(r);
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration' });
  }
});

router.delete('/registrations/:id', protect, checkPermission(PERMISSIONS.MANAGE_CUSTOMERS), async (req, res) => {
  try {
    const { id } = req.params;
    const reg = await Registration.findByIdAndDelete(id);
    const reason = req.body.reason || 'Không có lý do';
    await logActivity(req, 'DELETE', reg ? `${reg.lastName} ${reg.firstName}` : 'Học viên', id, `Lý do: ${reason}`);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting registration' });
  }
});

// --- CONTACT ROUTES ---
router.post('/contact-advice', async (req, res) => {
  try {
    if (!req.body.phone || !isValidPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ (10 số, đầu 03/05/07/08/09)' });
    }

    const contactData = { ...req.body };
    if (contactData.phone) contactData.phone = encrypt(contactData.phone);

    const contact = new Contact(contactData);
    await contact.save();

    await new Notification({
      type: 'contact',
      message: `Tư vấn mới: ${req.body.fullname} - ${req.body.phone}`,
      relatedId: contact._id
    }).save();

    const { fullname, phone, course, note } = req.body;

    const subject = 'Yêu cầu tư vấn mới';
    const text = `
      Tư vấn từ: ${fullname}
      SĐT: ${phone}
      Khóa học: ${course || 'N/A'}
      Nội dung: ${note || 'N/A'}
    `;

    await sendEmail(subject, text);

    res.status(200).json({ message: 'Advice request successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving contact' });
  }
});

// Các route GET/PUT/DELETE contact tương tự...
router.get('/contacts', protect, checkPermission(PERMISSIONS.VIEW_CUSTOMERS), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ _id: -1 }); // Lấy danh sách mới nhất lên đầu
    const decryptedContacts = contacts.map(contact => {
      const c = contact.toObject();
      if (c.phone) c.phone = decrypt(c.phone); // Giải mã Số điện thoại để Admin đọc được
      return c;
    });
    res.status(200).json(decryptedContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

router.put('/contacts/:id', protect, checkPermission(PERMISSIONS.MANAGE_CUSTOMERS), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.phone) updateData.phone = encrypt(updateData.phone);

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });
    const c = updatedContact.toObject();
    if (c.phone) c.phone = decrypt(c.phone);
    
    await logActivity(req, 'UPDATE', 'Contact', req.params.id, `Cập nhật trạng thái liên hệ`);
    res.json(c);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact' });
  }
});

router.delete('/contacts/:id', protect, checkPermission(PERMISSIONS.MANAGE_CUSTOMERS), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    await logActivity(req, 'DELETE', contact ? contact.fullname : 'Liên hệ', req.params.id, 'Xóa yêu cầu tư vấn');
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

module.exports = router;