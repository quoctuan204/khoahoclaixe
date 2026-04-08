const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import Model Khóa học
const Contact = require('../models/Contact'); // Import Model Contact
const Notification = require('../models/Notification'); // Import Model Notification
const { encrypt } = require('../utils/encryption'); // Import hàm mã hóa
const { sendEmail } = require('../utils/helpers'); // Import hàm gửi email

// Hàm phụ trợ 1: Loại bỏ dấu tiếng Việt và In thường (Giúp nhận diện kể cả khi gõ "hoc phi" hay "HỌC PHÍ")
const normalizeText = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
};

// Hàm phụ trợ 2: Tự động viết hoa chữ cái đầu của Tên khách hàng (VD: "nguyễn văn a" -> "Nguyễn Văn A")
const capitalizeName = (str) => {
  return str.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Biến lưu trữ tạm thời trên RAM để chống Spam
const recentPhones = new Set(); 
const ipPhoneSubmissions = new Map();
const pendingNames = new Map(); // Lưu trạng thái chờ khách nhập tên

router.post('/', async (req, res) => {
  try {
    const { history } = req.body;
    
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ message: 'Lịch sử trò chuyện không hợp lệ' });
    }

    // Lấy tin nhắn mới nhất
    const latestMessage = history[history.length - 1].text;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // --- LOGIC TRÍCH XUẤT VÀ LƯU SỐ ĐIỆN THOẠI TỰ ĐỘNG ---
    // Xóa khoảng trắng, dấu chấm, dấu gạch ngang để dễ quét SĐT (VD: 0912 345 678 -> 0912345678)
    const cleanedMessage = latestMessage.replace(/[\s\.\-]/g, '');
    const phoneRegex = /(03|05|07|08|09)[0-9]{8}/;
    const phoneMatch = cleanedMessage.match(phoneRegex);

    let phoneReply = '';
    if (phoneMatch) {
      const extractedPhone = phoneMatch[0];

      // Khởi tạo hoặc lấy lịch sử theo IP (Reset mỗi 1 giờ)
      const ipData = ipPhoneSubmissions.get(clientIp) || { count: 0, resetTime: Date.now() + 60 * 60 * 1000 };
      if (Date.now() > ipData.resetTime) {
        ipData.count = 0;
        ipData.resetTime = Date.now() + 60 * 60 * 1000;
      }

      // Chỉ lưu nếu SĐT chưa được gửi gần đây VÀ IP này gửi chưa quá 3 số trong 1 giờ
      if (!recentPhones.has(extractedPhone) && ipData.count < 3) {
        // Đánh dấu SĐT đã được xử lý và tự động xóa khỏi bộ nhớ sau 24h
        recentPhones.add(extractedPhone);
        setTimeout(() => recentPhones.delete(extractedPhone), 24 * 60 * 60 * 1000);
        
        // Tăng biến đếm số lượng SĐT của IP này
        ipData.count += 1;
        ipPhoneSubmissions.set(clientIp, ipData);

        try {
          const newContact = new Contact({
            fullname: 'Khách hàng (Từ Chatbot AI)',
            phone: encrypt(extractedPhone),
            course: 'Chưa xác định',
            note: `Hệ thống AI tự động thu thập từ Chatbot. Tin nhắn của khách: "${latestMessage}"`
          });
          const savedContact = await newContact.save();

          await new Notification({ type: 'contact', message: `AI Chatbot thu thập được SĐT mới: ${extractedPhone}`, relatedId: savedContact._id }).save();
          await sendEmail('Chatbot AI thu thập SĐT mới', `Khách hàng vừa cung cấp SĐT qua Chatbot: ${extractedPhone}\nTin nhắn: ${latestMessage}`);

          // Đưa IP này vào danh sách chờ nhập tên kèm ID của Database vừa tạo
          pendingNames.set(clientIp, { contactId: savedContact._id, timestamp: Date.now() });
          phoneReply = `Hệ thống đã ghi nhận số điện thoại. Bạn có thể cho mình xin Tên để tiện xưng hô và hỗ trợ được không ạ?`;
        } catch (err) {
          console.error('Lỗi khi lưu SĐT từ Chatbot:', err);
        }
      } else {
        console.log(`[Spam Guard] Đã chặn SĐT ${extractedPhone} từ IP ${clientIp}`);
      }
    }
    // ----------------------------------------------------

    const products = await Product.find({ isVisible: { $ne: false } });
    
    // --- LOGIC TRẢ LỜI TỰ ĐỘNG THEO TỪ KHÓA (KHÔNG DÙNG API NGOÀI) ---
    const normalizedMsg = normalizeText(latestMessage);
    let reply = '';
    let link = null;
    let image = null;

    if (normalizedMsg.includes('b1') || normalizedMsg.includes('tu dong')) {
      const b1 = products.find(p => p.title.toLowerCase().includes('b1')) || products[0];
      reply = `Dạ, khóa học ${b1 ? b1.title : 'Hạng B1'} hiện có giá là ${b1 ? b1.price : 'đang cập nhật'}. Thời gian học khoảng 3 tháng. ${phoneReply ? '' : 'Bạn vui lòng để lại số điện thoại để trung tâm tư vấn chi tiết hơn nhé!'}`;
      if (b1) {
        link = `/product/${b1.id}`;
        image = b1.image;
      }
    } else if (normalizedMsg.includes('b2') || normalizedMsg.includes('so san') || ((normalizedMsg.includes('bang b') || normalizedMsg.includes('hang b') || /\bb\b/.test(normalizedMsg)) && !normalizedMsg.includes('b1'))) {
      const b = products.find(p => p.title.toLowerCase().includes('b2') || (normalizeText(p.title).includes('hang b') && !normalizeText(p.title).includes('b1'))) || products[1];
      reply = `Khóa học ${b ? b.title : 'Hạng B (B2 cũ)'} hiện có giá là ${b ? b.price : 'đang cập nhật'}. Thời gian học khoảng 3.5 tháng. ${phoneReply ? '' : 'Bạn có muốn trung tâm gọi lại hỗ trợ không? Cho mình xin SĐT nhé!'}`;
      if (b) {
        link = `/product/${b.id}`;
        image = b.image;
      }
    } else if (normalizedMsg.includes('bang c') || normalizedMsg.includes('hang c') || normalizedMsg.includes('xe tai') || /\bc\b/.test(normalizedMsg)) {
      const c = products.find(p => normalizeText(p.title).includes('c') && normalizeText(p.title).includes('tai'));
      reply = `Khóa học ${c ? c.title : 'Hạng C'} hiện có giá là ${c ? c.price : 'đang cập nhật'}. Thời gian học là 3.5 tháng. ${phoneReply ? '' : 'Bạn vui lòng để lại số điện thoại để giữ ưu đãi ạ.'}`;
      if (c) {
        link = `/product/${c.id}`;
        image = c.image;
      }
    } else if (normalizedMsg.includes('thong tin')) {
      const coursesInfo = products.map(p => `- ${p.title}: Học phí khoảng ${p.price || 'đang cập nhật'}`).join('\n');
      reply = `Dạ, hiện tại trung tâm đang đào tạo các khóa học lái xe sau ạ:\n${coursesInfo}\n\nBạn có thể vào mục "Khóa học" trên Menu để xem chi tiết, hoặc cho mình biết bạn quan tâm hạng bằng nào nhé!`;
    } else if (normalizedMsg.includes('gia') || normalizedMsg.includes('hoc phi') || normalizedMsg.includes('bao nhieu') || normalizedMsg.includes('chi phi')) {
      const coursesInfo = products.map(p => `- ${p.title}: ${p.price}`).join('\n');
      reply = `Hiện tại trung tâm có các khóa học với mức giá như sau ạ:\n${coursesInfo}\n\nBạn đang quan tâm hạng bằng nào để mình tư vấn sâu hơn ạ?`;
    } else if (normalizedMsg.includes('thoi gian') || normalizedMsg.includes('bao lau')) {
      reply = `Dạ, thời gian học các khóa từ lúc nộp hồ sơ đến khi thi thông thường là từ 3 đến 3.5 tháng. Bạn muốn học bằng hạng nào ạ?`;
    } else if (normalizedMsg.includes('dang ky') || normalizedMsg.includes('thu tuc') || normalizedMsg.includes('ho so')) {
      reply = `Thủ tục đăng ký rất đơn giản, bạn chỉ cần chuẩn bị CMND/CCCD và khám sức khỏe nhé. ${phoneReply ? '' : 'Bạn để lại số điện thoại để chuyên viên hướng dẫn cách nộp hồ sơ online hoặc nộp trực tiếp ạ!'}`;
    } else if (normalizedMsg.includes('chao') || normalizedMsg.includes('hi ') || normalizedMsg === 'hi' || normalizedMsg.includes('hello')) {
      reply = `Chào bạn! Mình là trợ lý tự động của Trung tâm. Bạn cần tìm hiểu thông tin về học phí, lịch học, hay thủ tục đăng ký ạ?`;
    } else {
      reply = phoneReply ? '' : `Dạ, hiện tại do mình là hệ thống tự động trả lời theo từ khóa nên chưa hiểu rõ ý của bạn. Bạn vui lòng để lại số điện thoại, nhân viên tư vấn sẽ liên hệ lại hỗ trợ bạn ngay nhé!`;
    }

    // Ghép câu trả lời từ khóa và câu xin tên (nếu có SĐT)
    if (phoneReply) {
      reply = reply ? `${reply.trim()}\n\n${phoneReply}` : phoneReply;
    }

    res.json({ reply, link, image });
  } catch (error) {
    console.error('Lỗi xử lý Chatbot:', error);
    res.status(500).json({ reply: 'Xin lỗi, hệ thống đang bận. Bạn vui lòng gọi trực tiếp Hotline hoặc để lại số điện thoại nhé!' });
  }
});

module.exports = router;