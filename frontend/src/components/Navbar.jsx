import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets.js'
import SmartNavLink from './SmartNavLink'
import SmartLink from './SmartLink'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAdmin, logout, user } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const [hotline, setHotline] = useState('1900 1000')
  const navRef = useRef(null)
  const adminDropdownRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => { if(data.hotline) setHotline(data.hotline) })
      .catch(err => console.error(err))
  }, [API_BASE])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false) // Đóng menu mobile
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false) // Đóng menu admin
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={navRef} className="sticky top-0 z-50 bg-white py-5 font-medium shadow-sm">
      {/* WRAPPER */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 flex items-center justify-between">

        {/* LOGO – RELOAD PAGE */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            aria-label="Home"
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={assets.logo}
              className="w-14 h-auto object-contain"
              alt="Logo Trường đào tạo sát hạch"
            />
            <span className="ml-2 text-sm hidden sm:inline">
              Trường đào tạo sát hạch
            </span>
          </a>
        </div>

        {/* MENU DESKTOP */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          {[
            { to: '/', label: 'Trang chủ' },
            { to: '/gioi_thieu', label: 'Giới thiệu' },
            { to: '/khoa_hoc', label: 'Khóa học' },
            { to: '/hoc_phi', label: 'Học phí' },
            { to: '/thu-vien-video', label: 'Video' },
            { to: '/tin_tuc', label: 'Tin tức' },
            { to: '/lien_he', label: 'Liên hệ' },
          ].map(item => (
            <SmartNavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1"
            >
              <p>{item.label}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </SmartNavLink>
          ))}
        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <a
            className="hidden md:flex flex-col items-end mr-2"
            href={`tel:${hotline.replace(/\s/g, '')}`}
          >
            <span className="text-xs text-gray-500 font-medium">
              Hotline tư vấn
            </span>
            <span className="text-yellow-500 font-bold text-base">
              {hotline}
            </span>
          </a>

          {/* ROLE SWITCH (dev-friendly) */}
          {isAdmin && (
            <div className="relative" ref={adminDropdownRef}>
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
                <div className='hidden sm:block text-right'>
                  <p className='text-sm font-bold text-gray-900'>{user?.fullName || user?.username || 'Admin'}</p>
                  <p className='text-xs text-gray-500'>Giảng viên</p>
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
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200'>
                    <Link 
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium'
                    >
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                      Trang quản trị
                    </Link>
                    <Link 
                      to="/admin/profile"
                      onClick={() => setDropdownOpen(false)}
                      className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium'
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      Hồ sơ cá nhân
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
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
              )}
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
          >
            {!open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>

          {/* CTA DESKTOP */}
          {!isAdmin && (
            <SmartLink
              to="/dangkykhoahoc"
              className="hidden md:flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-md hover:bg-blue-700"
            >
              Đăng ký ngay
            </SmartLink>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
          <nav className="flex flex-col px-4 py-3">
            <SmartNavLink to="/" onClick={() => setOpen(false)} className="py-3 border-b">
              Trang chủ
            </SmartNavLink>
            <SmartNavLink to="/course" onClick={() => setOpen(false)} className="py-3 border-b">
              Khóa học
            </SmartNavLink>
            <SmartNavLink to="/tuition" onClick={() => setOpen(false)} className="py-3 border-b">
              Học phí
            </SmartNavLink>
            <SmartNavLink to="/thu-vien-video" onClick={() => setOpen(false)} className="py-3 border-b">
              Video
            </SmartNavLink>
            <SmartNavLink to="/news" onClick={() => setOpen(false)} className="py-3 border-b">
              Tin tức
            </SmartNavLink>
            <SmartNavLink to="/contact" onClick={() => setOpen(false)} className="py-3 border-b">
              Liên hệ
            </SmartNavLink>

            {/* CTA MOBILE */}
            {!isAdmin && (
              <SmartLink
                to="/dangkykhoahoc"
                onClick={() => setOpen(false)}
                className="mt-4 w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg"
              >
                Đăng ký ngay
              </SmartLink>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}

export default Navbar