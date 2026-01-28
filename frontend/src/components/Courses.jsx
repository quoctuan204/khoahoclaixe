import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'

const Courses = () => {
  const navigate = useNavigate();
  const handleOpen = (id) => navigate(`/product/${id}`)
  const [courseList, setCourseList] = useState(products)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        if (res.ok) {
          const dbProducts = await res.json()
          
          // 1. Cập nhật thông tin cho các khóa học có sẵn (trong file tĩnh)
          const mergedStatic = products.map(p => {
            const dbP = dbProducts.find(dp => dp.id === p.id)
            const finalP = dbP ? { ...p, ...dbP } : p
            if (finalP.image && typeof finalP.image === 'string' && finalP.image.startsWith('/uploads/')) {
              finalP.image = `${API_BASE}${finalP.image}`
            }
            return finalP
          })

          // 2. Lấy thêm các khóa học mới từ DB (không có trong file tĩnh)
          const newFromDb = dbProducts.filter(dp => !products.find(p => p.id === dp.id)).map(dp => {
             if (dp.image && typeof dp.image === 'string' && dp.image.startsWith('/uploads/')) {
               return { ...dp, image: `${API_BASE}${dp.image}`, highlights: dp.highlights || [] }
            }
            return { ...dp, highlights: dp.highlights || [] }
          })

          setCourseList([...mergedStatic, ...newFromDb])
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [API_BASE])

  return (
    <div className='bg-[#f8f9fa] py-16 lg:py-24' id='khoa-hoc'>
      <div className='layout-container flex justify-center'>
        <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
          <div className='text-center mb-12'>
            <h2 className='text-[#111318] text-3xl lg:text-4xl font-black mb-4'>
              Các khóa học nổi bật
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
                Chọn khóa học phù hợp với nhu cầu của bạn. Chúng tôi cung cấp đầy đủ các hạng bằng lái xe phổ biến nhất hiện nay.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {courseList.map((p) => (
              <div 
                key={p.id} 
                onClick={() => p.isVisible !== false && handleOpen(p.id)} 
                className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg transition-all duration-300 group ${p.isVisible === false ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl'}`}
              >
                <div className='h-64 overflow-hidden relative'>
                  {p.id === 'b1-sotudong' && (
                    <div className='absolute top-4 left-4 z-10 bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide'>
                      Phổ biến nhất
                    </div>
                  )}
                  {p.isVisible === false && (
                    <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/10'>
                      <span className='bg-gray-800 text-white px-4 py-2 rounded-lg font-bold shadow-md'>Tạm ngưng</span>
                    </div>
                  )}
                  <img src={p.image} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt={p.title} />
                </div>
                <div className='p-6 flex flex-col flex-1'>
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-2xl font-bold text-[#111318]'>
                      {p.title}
                    </h3>
                  </div>
                  <p className='text-gray-500 text-sm mb-4 line-clamp-2'>
                    {p.description}
                  </p>
                  <ul className='flex flex-col gap-2 mb-6'>
                    <li className='flex items-center gap-2 text-sm text-gray-700'>
                      <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span> Thời gian học: {p.duration}
                    </li>
                    <li className='flex items-center gap-2 text-sm text-gray-700'>
                      <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span> Xe tập: {p.vehicle}
                    </li>
                    {p.highlights.map((h, i) => (
                      <li key={i} className='flex items-center gap-2 text-sm text-gray-700'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span> {h}
                      </li>
                    ))}
                  </ul>

                  <div className='mt-auto pt-4 border-t border-gray-100 flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-xs text-gray-400 line-through'>{p.oldPrice}</span>
                      <span className='text-xl font-bold text-red-500'>{p.price}</span>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); p.isVisible !== false && handleOpen(p.id) }} 
                      disabled={p.isVisible === false}
                      className={`rounded-lg font-bold px-4 py-2 transition-colors ${p.isVisible === false ? 'bg-gray-400 text-white cursor-not-allowed' : 'cursor-pointer bg-blue-500 hover:bg-blue-700 text-white hover:text-white text-primary'}`}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
