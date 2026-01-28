import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()

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
            <span className='md:hidden font-black text-[#135bec] text-lg'>ADMIN PANEL</span>
          </div>

          <div className='relative'>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className='flex items-center gap-3 focus:outline-none'
            >
              <div className='text-right hidden sm:block'>
                <p className='text-sm font-bold text-gray-900'>{user?.username || 'Admin'}</p>
                <p className='text-xs text-gray-500'>Quản trị viên</p>
              </div>
              <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#135bec] font-bold border border-blue-200 uppercase hover:bg-blue-200 transition-colors'>
                {user?.username ? user.username.charAt(0) : 'A'}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200'>
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

        <div className='p-4 md:p-8 overflow-x-hidden'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout