import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import SmartNavLink from './SmartNavLink'
import SmartLink from './SmartLink'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const RoleControls = ({ isAdmin, logout }) => {
  if (isAdmin) {
    return (
      <div className='flex items-center gap-2'>
        <Link to='/admin' className='text-sm text-[#135bec] hover:underline'>Giảng viên</Link>
        <button onClick={logout} className='text-sm bg-[#f97316] text-white px-3 py-1 rounded'>Đăng xuất</button>
      </div>
    )
  }

  // normal users: hide quick admin login control
  return null
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAdmin, logout } = useAuth()

  return (
    <div className="sticky top-0 z-50 bg-white py-5 font-medium shadow-sm">
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
            href="tel:19001000"
          >
            <span className="text-xs text-gray-500 font-medium">
              Hotline tư vấn
            </span>
            <span className="text-yellow-500 font-bold text-base">
              1900 1000
            </span>
          </a>

          {/* ROLE SWITCH (dev-friendly) */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <small className='text-xs text-gray-500 mr-2'>Role:</small>
            {/* show different controls based on role */}
            <RoleControls isAdmin={isAdmin} logout={logout} />
          </div>

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
          <SmartLink
            to="/dangkykhoahoc"
            className="hidden md:flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-md hover:bg-blue-700"
          >
            Đăng ký ngay
          </SmartLink>
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
            <SmartNavLink to="/news" onClick={() => setOpen(false)} className="py-3 border-b">
              Tin tức
            </SmartNavLink>
            <SmartNavLink to="/contact" onClick={() => setOpen(false)} className="py-3 border-b">
              Liên hệ
            </SmartNavLink>

            {/* CTA MOBILE */}
            <SmartLink
              to="/dangkykhoahoc"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg"
            >
              Đăng ký ngay
            </SmartLink>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Navbar