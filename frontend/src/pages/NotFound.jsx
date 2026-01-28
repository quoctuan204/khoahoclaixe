import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center'>
      <h1 className='text-9xl font-black text-gray-200'>404</h1>
      <h2 className='text-3xl font-bold text-gray-800 mt-4'>Không tìm thấy trang</h2>
      <p className='text-gray-600 mt-2 mb-8 max-w-md mx-auto'>
        Trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập vào khu vực này.
      </p>
      <div className='flex gap-4'>
        <button 
          onClick={() => navigate(-1)}
          className='px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors'
        >
          Quay lại
        </button>
        <Link 
          to="/" 
          className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#135bec] hover:bg-blue-700 transition-colors shadow-lg'
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFound