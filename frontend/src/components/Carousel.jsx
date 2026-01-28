import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

const Carousel = () => {
  const slides = [
    { url: assets.heroImg, title: 'Sân tập lái xe hiện đại' },
    { url: assets.heroImg2, title: 'Hệ thống xe tập đời mới' },
    { url: assets.heroImg3, title: 'Đội ngũ giáo viên giàu kinh nghiệm' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex])

  return (
    <div className='max-w-[1280px] mx-auto px-4 lg:px-10 py-16 group'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl font-black text-gray-900'>Hình ảnh nổi bật</h2>
        <p className='text-gray-500 mt-2'>Khám phá cơ sở vật chất và hoạt động đào tạo tại trung tâm</p>
      </div>
      
      <div className='relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl'>
        <div 
            style={{ backgroundImage: `url(${slides[currentIndex].url})` }} 
            className='w-full h-full bg-center bg-cover duration-700 ease-in-out transition-all'
        >
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-8'>
                <h3 className='text-white text-xl md:text-3xl font-bold drop-shadow-md px-4 text-center'>{slides[currentIndex].title}</h3>
            </div>
        </div>

        {/* Left Arrow */}
        <div className='hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-4 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all backdrop-blur-sm'>
            <span onClick={prevSlide} className="material-symbols-outlined text-3xl">chevron_left</span>
        </div>

        {/* Right Arrow */}
        <div className='hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-4 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all backdrop-blur-sm'>
            <span onClick={nextSlide} className="material-symbols-outlined text-3xl">chevron_right</span>
        </div>

        {/* Dots */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
            {slides.map((_, slideIndex) => (
            <div
                key={slideIndex}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`transition-all duration-300 cursor-pointer rounded-full shadow-sm ${currentIndex === slideIndex ? 'w-8 h-2 bg-[#135bec]' : 'w-2 h-2 bg-white/80 hover:bg-white'}`}
            ></div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel