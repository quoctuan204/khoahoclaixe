import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HeroTuition = () => {
  return (
    <div className='relative w-full bg-surface-dark py-16 md:py-24'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-background-dark/90 to-background-dark/60 z-10'></div>
        <div className='h-full w-full bg-cover bg-center'>
            <img src={assets.herotuition} className='h-full w-full bg-cover bg-center' alt=""/>
        </div>
      </div>
      <div className='relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
        <h1 className='mx-auto max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Bảng Giá Học Lái Xe 2024 <br/> <span className="text-[#f97316]">Minh Bạch &amp; Ưu Đãi</span>
        </h1>
        <p className='mx-auto mt-6 max-w-2xl text-lg text-gray-300'>
            Cam kết không phát sinh chi phí. Hỗ trợ trả góp 0%. <br className='hidden sm:block'/>
            Đào tạo bài bản, tỉ lệ đậu cao, giáo viên tận tâm.
        </p>
        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link to='/lien_he' className='h-12 min-w-[160px] rounded-xl bg-[#135bec] px-6 text-base font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 hover:-translate-y-0.5 flex items-center justify-center'>
                Tư vấn miễn phí
            </Link>
            <Link to='/chinhsachhocphi' className='h-12 min-w-[160px] rounded-xl bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 flex items-center justify-center'>
                Xem chi tiết
            </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroTuition
