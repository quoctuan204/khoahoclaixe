import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  const fetchNotifications = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      // Nếu token hết hạn hoặc không hợp lệ (401), tự động đăng xuất
      if (res.status === 401) {
        logout()
        return
      }
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Poll every 1 minute
    return () => clearInterval(interval)
  }, [token])

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await fetch(`${API_BASE}/api/notifications/${notif._id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n))
      } catch (error) {
        console.error(error)
      }
    }
    
    if (notif.type === 'registration') {
      navigate(`/admin/student/${notif.relatedId}`)
    } else if (notif.type === 'contact') {
      navigate('/admin/contacts')
    }
    setNotifOpen(false)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className='flex-1 flex flex-col md:ml-64 transition-all duration-300 min-w-0'>
        {/* Header */}
        <div className='bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30'>
          <div className='flex items-center'>
            <button onClick={() => setSidebarOpen(true)} className='md:hidden text-gray-600 p-2 rounded-md hover:bg-gray-100 mr-3'>
              <span className='material-symbols-outlined'>menu</span>
            </button>
            <Link to="/" className='md:hidden font-black text-[#135bec] text-lg hover:text-blue-700 transition-colors'>ADMIN PANEL</Link>
          </div>

          <div className='flex items-center gap-4'>
            {/* Notifications */}
            <div className='relative'>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className='p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors'
              >
                <span className="material-symbols-outlined text-2xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)}></div>
                  <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-200 max-h-[400px] overflow-y-auto'>
                    <div className='px-4 py-2 border-b border-gray-100 font-bold text-gray-700'>Thông báo</div>
                    {notifications.length === 0 ? (
                      <div className='px-4 py-4 text-sm text-gray-500 text-center'>Không có thông báo mới</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{notif.message}</p>
                          <p className='text-xs text-gray-400 mt-1'>{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* User Dropdown */}
            <div className='relative'>
            {(() => {
              let avatarUrl = user?.avatar;
              if (avatarUrl) {
                  avatarUrl = avatarUrl.replace(/\\/g, '/');
                  if (avatarUrl.startsWith('uploads/')) avatarUrl = '/' + avatarUrl;
                  if (avatarUrl.startsWith('/uploads/')) avatarUrl = `${API_BASE}${avatarUrl}`;
              }
              return (
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='flex items-center gap-3 focus:outline-none'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-bold text-gray-900'>{user?.fullName || user?.username || 'Admin'}</p>
                <p className='text-xs text-gray-500'>Quản trị viên</p>
              </div>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className='h-10 w-10 rounded-full object-cover border border-blue-200'
                />
              ) : (
                <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#135bec] font-bold border border-blue-200 uppercase hover:bg-blue-200 transition-colors'>
                  {user?.fullName ? user.fullName.charAt(0) : (user?.username ? user.username.charAt(0) : 'A')}
                </div>
              )}
            </button>
            )
            })()}

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200'>
                  <Link 
                    to="/admin/profile"
                    onClick={() => setDropdownOpen(false)}
                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium'
                  >
                    <span className="material-symbols-outlined text-lg">person</span>
                    Hồ sơ của tôi
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium'
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        </div>

        <div className='p-4 md:p-8 overflow-x-hidden'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout