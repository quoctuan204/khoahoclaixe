import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 

const Pricing = () => {
  const [courseList, setCourseList] = useState([])
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        if (res.ok) {
          const data = await res.json()
          setCourseList(data.filter(p => p.isVisible !== false))
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [API_BASE])

  if (courseList.length === 0) return null

  return (
    <div className='px-4 py-16 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center bg-white dark:bg-[#1a202c]' id='khoa-hoc'>
      <div className='flex flex-col max-w-[1200px] flex-1 gap-10'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6'>
            <div>
                <h2 className='text-[#135bec] font-bold tracking-wider uppercase text-sm mb-2'>
                    Các khóa học tiêu chuẩn
                </h2>
                <h1 className='text-[#111318] dark:text-white text-3xl font-black leading-tight'>
                    Bảng giá &amp; Lộ trình
                </h1>
            </div>
            <p className='text-[#616f89] dark:text-gray-400 max-w-md text-sm md:text-right'>
                Cam kết không phát sinh chi phí trong quá trình học. <br/>Học phí đã bao gồm lệ phí thi, xăng xe, sân bãi.
            </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courseList.map((product, index) => {
            // Logic để highlight card giữa hoặc card B2
            const isHighlight = product.id.includes('b2') || index === 1
            
            return (
              <div key={product.id} className={`relative flex flex-col gap-6 rounded-2xl border-2 ${isHighlight ? 'border-[#135bec] shadow-2xl z-20 transform lg:-translate-y-4' : 'border-gray-200 shadow-sm hover:shadow-xl'} bg-white dark:bg-[#232b3a] p-8 transition-all`}>
                  {isHighlight && (
                    <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm'>
                        Phổ biến nhất
                    </div>
                  )}
                  <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between'>
                          <h3 className='text-[#111318] dark:text-white text-xl font-bold'>{product.title}</h3>
                          <span className='material-symbols-outlined text-gray-400'>directions_car</span>
                      </div>
                      <p className='text-[#616f89] dark:text-gray-400 text-sm line-clamp-2'>{product.description}</p>
                  </div>
                  <div className='flex items-baseline gap-1'>
                      <span className={`text-4xl font-black tracking-tight ${isHighlight ? 'text-[#f97316]' : 'text-[#135bec]'}`}>{product.price}</span>
                      <span className='text-gray-500 text-sm font-medium'>/ Khóa</span>
                  </div>
                  <Link 
                    to='/dangkykhoahoc' 
                    state={{ course: product.id, courseName: product.title, imageKey: product.image }} 
                    className={`w-full cursor-pointer rounded-lg h-12 text-white text-base font-bold transition-colors shadow-lg flex items-center justify-center ${isHighlight ? 'bg-[#f97316] hover:bg-orange-600' : 'bg-[#135bec] hover:bg-blue-700'}`}
                  >
                      Đăng ký ngay
                  </Link> 
                  
                  <div className='flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700 pt-6'>
                      {product.highlights && product.highlights.map((hl, i) => (
                        <div key={i} className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                            <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                            <span>{hl}</span>
                        </div>
                      ))}
                      {(!product.highlights || product.highlights.length === 0) && (
                         <p className="text-sm text-gray-400 italic">Đang cập nhật thông tin chi tiết...</p>
                      )}
                  </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pricing
