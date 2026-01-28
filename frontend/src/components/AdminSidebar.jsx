import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth()

  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/admin/contacts', icon: 'contact_phone', label: 'Yêu cầu tư vấn' },
    // Bạn có thể thêm link tới danh sách khóa học nếu muốn quản lý tập trung
    { path: '/admin/courses', icon: 'school', label: 'Quản lý Khóa học' }, 
    { path: '/admin/gallery', icon: 'photo_library', label: 'Thư viện ảnh' },
    { path: '/admin/videos', icon: 'smart_display', label: 'Quản lý Video' },
    { path: '/admin/news', icon: 'article', label: 'Tin tức' },
    { path: '/admin/audit-logs', icon: 'history', label: 'Lịch sử hoạt động' },
    { path: '/admin/settings', icon: 'settings', label: 'Cài đặt' },
  ]

  return (
    <>
      {/* Mobile Overlay (Lớp phủ đen mờ khi mở menu trên mobile) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      <div className={`w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className='h-16 flex items-center px-6 border-b border-gray-200'>
        <NavLink to="/" className='text-xl font-black text-[#135bec]'>ADMIN PANEL</NavLink>
      </div>

      <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={() => window.innerWidth < 768 && onClose && onClose()} // Tự đóng khi click link trên mobile
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#135bec] font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className='material-symbols-outlined'>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className='p-4 border-t border-gray-200'>
        <button onClick={logout} className='flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium'>
          <span className='material-symbols-outlined'>logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
    </>
  )
}

export default AdminSidebar