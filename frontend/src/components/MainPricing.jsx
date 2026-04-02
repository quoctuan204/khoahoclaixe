import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 
import FadeIn from './FadeIn'
import { products } from '../data/products'

const MainPricing = () => {
  const [courseList, setCourseList] = useState(products)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const scrollRef = useRef(null)
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
          const mergedStatic = products.map(p => {
            const dbP = dbProducts.find(dp => dp.id === p.id)
            return dbP ? { ...p, ...dbP } : p
          })
          const newFromDb = dbProducts.filter(dp => !products.find(p => p.id === dp.id))
          const finalCourses = [...mergedStatic, ...newFromDb].filter(p => p.isVisible !== false)
          setCourseList(finalCourses)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchProducts()
  }, [API_BASE])

  if (courseList.length === 0) return null

  const scroll = (direction) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const itemWidth = scrollRef.current.children[0].offsetWidth + 32 // gap-8 là 32px
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleMouseDown = (e) => {
    setIsDown(true)
    dragged.current = false
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
    const walk = (x - startX.current) * 1
    if (Math.abs(walk) > 10) dragged.current = true
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk
  }

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

        <div className='relative group'>
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
            className={`flex overflow-x-auto gap-8 pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDown ? 'cursor-grabbing snap-none select-none' : 'cursor-grab snap-x snap-mandatory'}`}
          >
          {courseList.map((product, index) => {
            const isHighlight = product.id.includes('b2') || index === 1
            return (
              <FadeIn key={product.id} delay={index * 150} className='w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333333%-21.33px)] snap-center shrink-0 flex'>
                <div className={`w-full cursor-pointer group relative flex flex-col rounded-2xl border ${isHighlight ? 'border-2 border-[#135bec] shadow-xl z-10 transform lg:-translate-y-1' : 'border-gray-200 shadow-sm hover:shadow-xl'} bg-[#ffffff] p-8 transition dark:border-gray-700 dark:bg-surface-dark`}>
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
                    onClick={(e) => { if (dragged.current) e.preventDefault() }}
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
              </FadeIn>
            )
          })}
          </div>
          <button 
            onClick={() => scroll('right')}
            className='absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 text-[#135bec] hover:bg-[#135bec] hover:text-white transition-all opacity-0 group-hover:opacity-100'
          >
            <span className='material-symbols-outlined text-3xl'>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainPricing
