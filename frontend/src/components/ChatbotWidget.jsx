import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem('chatbotIsOpen') === 'true';
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('chatbotMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { sender: 'bot', text: 'Chào bạn! Tôi là trợ lý AI của Trung tâm. Tôi có thể giúp gì cho bạn về các khóa học lái xe B1, B2, C?' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    sessionStorage.setItem('chatbotIsOpen', isOpen);
  }, [isOpen]);

  useEffect(() => {
    sessionStorage.setItem('chatbotMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // Tự động đóng chatbot khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Tự động đóng chatbot khi click hoặc chạm ra ngoài vùng chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory })
      });
      const data = await response.json();
      
      // Tách câu trả lời thành nhiều đoạn nhỏ dựa trên dấu ngắt dòng kép (\n\n)
      const botReplies = data.reply.split('\n\n').filter(text => text.trim() !== '');

      for (let i = 0; i < botReplies.length; i++) {
        if (i > 0) {
          setLoading(true); // Bật hiệu ứng "Đang nhập..." cho các tin nhắn sau
          await new Promise(resolve => setTimeout(resolve, 1500)); // Chờ 1.5 giây tạo cảm giác đang gõ
        }
        
        const isLast = i === botReplies.length - 1;
        let imageUrl = isLast ? data.image : null;
        if (imageUrl) {
            imageUrl = imageUrl.replace(/\\/g, '/');
            if (imageUrl.startsWith('uploads/')) imageUrl = '/' + imageUrl;
            if (imageUrl.startsWith('/uploads/')) imageUrl = `${API_BASE}${imageUrl}`;
        }
        setMessages(prev => [...prev, { sender: 'bot', text: botReplies[i].trim(), link: isLast ? data.link : null, image: imageUrl }]);
        setLoading(false);
      }
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau hoặc gọi Hotline.' }]);
      setLoading(false);
    }
  };

  const handleSend = () => handleSendMessage(input);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div ref={chatbotRef} className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-[#dbdfe6] overflow-hidden shadow-black/20">
          {/* Header */}
          <div className="bg-[#135bec] text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <span className="font-bold">AI Tư vấn viên</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-[#135bec] text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                  {msg.image && (
                    <img src={msg.image} alt="Hình ảnh khóa học" className="mt-3 rounded-lg w-full object-cover max-h-40 border border-gray-200 dark:border-gray-600" />
                  )}
                  {msg.link && (
                    <a href={msg.link} className="inline-block mt-2 text-[#135bec] font-semibold hover:underline">
                      Xem chi tiết khóa học &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            {/* Gợi ý câu hỏi thường gặp (Chỉ hiện khi chưa có ai chat) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 mt-1">
                {['Học phí bằng B2 bao nhiêu?', 'Thời gian học bao lâu?', 'Thủ tục đăng ký gồm những gì?'].map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(question)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-[#135bec] border border-blue-200 rounded-xl px-3 py-2 transition-colors text-left shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center h-10">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input type="text" className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] transition-all" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)} />
            <button onClick={handleSend} disabled={loading} className="bg-[#135bec] text-white w-10 h-10 shrink-0 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-gray-400">
              <span className="material-symbols-outlined text-[20px] ml-1">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-[#135bec] text-white w-14 h-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group">
          <span className="material-symbols-outlined text-3xl group-hover:animate-pulse">chat</span>
          <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white"></span>
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;