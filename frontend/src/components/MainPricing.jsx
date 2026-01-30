import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 

const MainPricing = () => {
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
    <div className='py-16 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-[#111318] dark:text-white sm:text-4xl'>
                Các Gói Học Phí Phổ Biến
            </h2>
            <p className='mt-4 text-lg text-[#616f89] dark:text-gray-400'>
                Lựa chọn hạng bằng phù hợp với nhu cầu của bạn
            </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8'>
          {courseList.map((product, index) => {
            const isHighlight = product.id.includes('b2') || index === 1
            return (
              <div key={product.id} className={`cursor-pointer group relative flex flex-col rounded-2xl border ${isHighlight ? 'border-2 border-[#135bec] shadow-xl z-10 transform lg:-translate-y-1' : 'border-gray-200 shadow-sm hover:shadow-xl'} bg-[#ffffff] p-8 transition dark:border-gray-700 dark:bg-surface-dark`}>
                  {isHighlight && (
                    <div className='absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-[#f97316] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm'>
                        Phổ biến nhất
                    </div>
                  )}
                  <div className='mb-6'>
                      <h3 className='text-lg font-bold text-[#111318] dark:text-white'>{product.title}</h3>
                      <p className='mt-2 text-sm text-[#616f89] dark:text-gray-400'>{product.description}</p>
                  </div>
                  <div className='mb-6 flex items-baseline gap-1'>
                      <span className={`text-4xl font-black tracking-tight ${isHighlight ? 'text-[#135bec]' : 'text-[#111318] dark:text-white'}`}>{product.price}</span>
                      <span className='text-sm font-semibold text-[#616f89] dark:text-gray-500'>/ khóa</span>
                  </div>
                  <Link 
                    to='/dangkykhoahoc' 
                    state={{ course: product.id, courseName: product.title, imageKey: product.image }} 
                    className={`cursor-pointer mb-8 w-full rounded-xl py-3 text-sm font-bold transition flex items-center justify-center ${isHighlight ? 'bg-[#135bec] text-white hover:bg-[#135bec]/90' : 'bg-gray-100 text-[#111318] hover:bg-gray-200 dark:bg-gray-800 dark:text-white'}`}
                  >
                      Đăng ký ngay
                  </Link> 
                  <ul className='flex flex-1 flex-col gap-4'>
                      {product.highlights && product.highlights.map((hl, i) => (
                        <li key={i} className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                            <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                            <span>{hl}</span>
                        </li>
                      ))}
                  </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MainPricing
