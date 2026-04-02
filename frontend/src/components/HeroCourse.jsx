import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 
import { products } from '../data/products'

const HeroCourse = () => {
  const [slides, setSlides] = useState([])
  const [idx, setIdx] = useState(0)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        if (res.ok) {
          const dbProducts = await res.json()
          
          const mergedStatic = products.map(p => {
            const dbP = dbProducts.find(dp => dp.id === p.id)
            return dbP ? { ...p, ...dbP } : p
          })
          const newFromDb = dbProducts.filter(dp => !products.find(p => p.id === dp.id))
          
          const validProducts = [...mergedStatic, ...newFromDb].filter(p => p.isVisible !== false)
          const newSlides = validProducts.map(p => {
            let imgUrl = p.image;
            if (imgUrl) {
                imgUrl = imgUrl.replace(/\\/g, '/');
                if (imgUrl.startsWith('uploads/')) imgUrl = '/' + imgUrl;
                if (imgUrl.startsWith('/uploads/')) imgUrl = `${API_BASE}${imgUrl}`;
            }
            return {
              key: p.id,
              img: imgUrl || assets.b1sotudong,
              title: p.title,
              productId: p.id
            };
          })
          setSlides(newSlides.length > 0 ? newSlides : [])
        }
      } catch (error) {
        console.error('Failed to fetch hero courses', error)
      }
    }
    fetchProducts()

    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [slides.length, API_BASE])

  if (slides.length === 0) return null

  return (
    <div className='px-4 py-10 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center bg-white dark:bg-[#1a202c]'>
      <div className='flex flex-col max-w-[1200px] flex-1'>
        <div className='@container'>
            <div className='flex flex-col-reverse gap-6 py-10 @[480px]:gap-8 @[864px]:flex-row items-center'>
                <div className='flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:w-1/2 justify-center'>
                    <div className='flex flex-col gap-4 text-left'>
                        <div className='inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#135bec] ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-200'>
                            <span className='material-symbols-outlined text-[16px]'>verified</span> Ưu đãi 30% học phí hôm nay
                        </div>
                        <h1 className='text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl lg:text-6xl'>
                            Vững tay lái <br/>
                        <span className='text-[#135bec]'>Trọn hành trình</span>
                        </h1>
                        <h2 className='text-[#616f89] dark:text-gray-400 text-base font-normal leading-relaxed max-w-[500px]'>
                            Trung tâm đào tạo lái xe uy tín hàng đầu với lộ trình học bài bản. Cam kết tỉ lệ đậu trên 95%, hệ thống xe tập đời mới và đội ngũ giáo viên tận tâm 1 kèm 1.
                        </h2>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Link to='/lien_he' className='flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#f97316] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30'>
                            <span className='truncate'>Đăng ký tư vấn miễn phí</span>
                        </Link>
                        <button className='flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                            <span className='truncate'>Xem lịch khai giảng</span>
                        </button>
                    </div>
                </div>
                <div className='w-full @[864px]:w-1/2 relative'>
                    <div className='absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20'></div>

                    {/* Slider (B2 <-> C) */}
                    <div className='overflow-hidden rounded-2xl shadow-2xl relative z-10'>
                        <div className='flex transition-transform duration-700 ease-in-out' style={{ width: `${slides.length * 100}%`, transform: `translateX(-${idx * (100 / slides.length)}%)` }}>
                            {slides.map((s) => (
                                <Link key={s.key} to={`/product/${s.productId}`} className='flex-shrink-0 block' style={{ width: `${100 / slides.length}%` }}>
                                    <div className='relative aspect-[4/3]'>
                                        <img src={s.img} alt={s.title} className='w-full h-full object-cover rounded-2xl' />
                                        <div className='absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between border border-white/20 shadow-lg'>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Khóa học nổi bật</p>
                                            <p className='text-sm font-bold text-[#111318] dark:text-white'>{s.title}</p>
                                            <div className='h-10 w-10 bg-[#135bec] rounded-full flex items-center justify-center text-white'>
                                                <span className='cursor-pointer material-symbols-outlined'>arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* indicators removed as requested (no visible slider bar or control buttons) */}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCourse
