import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Quan trọng: Trạng thái chờ khi khởi tạo
    const navigate = useNavigate();
    const location = useLocation();

    // Effect này chạy 1 lần duy nhất khi App khởi động
    // để đọc lại thông tin đăng nhập từ Storage
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
            const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Lỗi đọc dữ liệu xác thực từ Storage:", error);
            // Xóa storage bị lỗi nếu có
            localStorage.clear();
            sessionStorage.clear();
        } finally {
            setLoading(false); // Đánh dấu đã kiểm tra xong
        }
    }, []);

    const login = ({ token, user, remember }) => {
        setToken(token);
        setUser(user);
        const storage = remember ? localStorage : sessionStorage;
        
        // Lưu token và user (đúng chuẩn)
        storage.setItem('token', token);
        storage.setItem('user', JSON.stringify(user));

        // Chuyển hướng về trang admin sau khi login thành công
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login'); // Chuyển về trang login khi đăng xuất
    };
    
    const updateUser = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    // isAdmin sẽ là true nếu có token và user object
    const isAdmin = !!token && !!user;

    const value = { token, user, isAdmin, loading, login, logout, updateUser, role: user?.role };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};