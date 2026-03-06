const crypto = require('crypto');

// Sử dụng key cố định cho demo (Trong thực tế nên để trong .env)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'khoahoclaixe_secret_key_2024_!!!'; // Phải đủ 32 ký tự
const IV_LENGTH = 16; // For AES, this is always 16

// Đảm bảo key đủ 32 bytes
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return text; // Trả về text gốc nếu lỗi (hoặc dữ liệu cũ chưa mã hóa)
  }
};

module.exports = { encrypt, decrypt };