import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import FadeIn from './FadeIn'

const Courses = () => {
  const navigate = useNavigate();
  const handleOpen = (id) => navigate(`/product/${id}`)
  const [courseList, setCourseList] = useState(products)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const scrollRef = useRef(null)
  
  // Trạng thái cho tính năng kéo vuốt bằng chuột
  const [isDown, setIsDown] = useState(false)
  const startX = useRef(0)
  const scrollLeftPos = useRef(0)
  const dragged = useRef(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        if (res.ok) {
          const dbProducts = await res.json()
          
          // Kết hợp dữ liệu tĩnh mặc định và dữ liệu từ DB (cập nhật hoặc thêm mới)
          const mergedStatic = products.map(p => {
            const dbP = dbProducts.find(dp => dp.id === p.id)
            const finalP = dbP ? { ...p, ...dbP } : p
            let img = finalP.image
            if (img) {
              img = img.replace(/\\/g, '/');
              if (img.startsWith('uploads/')) img = '/' + img;
              if (img.startsWith('/uploads/')) img = `${API_BASE}${img}`;
            }
            return { ...finalP, image: img, highlights: finalP.highlights || [] }
          })

          const newFromDb = dbProducts.filter(dp => !products.find(p => p.id === dp.id)).map(dp => {
            let img = dp.image
            if (img) {
              img = img.replace(/\\/g, '/');
              if (img.startsWith('uploads/')) img = '/' + img;
              if (img.startsWith('/uploads/')) img = `${API_BASE}${img}`;
            }
            return { ...dp, image: img, highlights: dp.highlights || [] }
          })

          const finalCourses = [...mergedStatic, ...newFromDb].filter(p => p.isVisible !== false)
          setCourseList(finalCourses)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [API_BASE])

  // Hàm xử lý cuộn khi bấm nút
  const scroll = (direction) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = scrollRef.current.children[0].offsetWidth + 24 // Chiều rộng thực tế của 1 thẻ + gap (24px)
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Các hàm xử lý kéo vuốt (Swipe bằng chuột)
  const handleMouseDown = (e) => {
    setIsDown(true)
    dragged.current = false // Reset trạng thái kéo
    if (!scrollRef.current) return
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeftPos.current = scrollRef.current.scrollLeft
  }

  const handleMouseLeave = () => setIsDown(false)
  const handleMouseUp = () => setIsDown(false)

  const handleMouseMove = (e) => {
    if (!isDown || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1 // Hệ số nhân tốc độ cuộn (giảm từ 1.5 xuống 1 để kéo chậm và tự nhiên hơn)
    if (Math.abs(walk) > 10) dragged.current = true // Đánh dấu là đang kéo chứ không phải click
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk
  }

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

        <div className='relative group'>
          {/* Nút sang trái */}
          <button 
            onClick={() => scroll('left')}
            className='absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-all opacity-0 group-hover:opacity-100'
          >
            <span className='material-symbols-outlined text-3xl'>chevron_left</span>
          </button>

          <div 
            ref={scrollRef} 
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto gap-6 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDown ? 'cursor-grabbing snap-none select-none' : 'cursor-grab snap-x snap-mandatory'}`}
          >
            {courseList.map((p, index) => (
              <FadeIn
                key={p.id}
                delay={index * 150} // Tạo độ trễ tăng dần để thẻ xuất hiện lần lượt
                className={`w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333333%-16px)] snap-center shrink-0 flex`}
              >
                <div 
                  onClick={(e) => {
                    if (dragged.current) return // Bỏ qua click nếu người dùng đang thực hiện thao tác kéo
                    p.isVisible !== false && handleOpen(p.id)
                  }} 
                  className={`w-full h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg transition-all duration-300 group ${p.isVisible === false ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl'}`}
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
                  <img 
                    src={p.image || undefined} 
                    draggable="false" 
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
                    alt={p.title} 
                  />
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
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (dragged.current) return; // Chặn click nhầm lúc đang kéo
                        p.isVisible !== false && handleOpen(p.id); 
                      }} 
                      disabled={p.isVisible === false}
                      className={`rounded-lg font-bold px-4 py-2 transition-colors ${p.isVisible === false ? 'bg-gray-400 text-white cursor-not-allowed' : 'cursor-pointer bg-blue-500 hover:bg-blue-700 text-white hover:text-white text-primary'}`}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
              </FadeIn>
            ))}
          </div>

          {/* Nút sang phải */}
          <button 
            onClick={() => scroll('right')}
            className='absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-all opacity-0 group-hover:opacity-100'
          >
            <span className='material-symbols-outlined text-3xl'>chevron_right</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
