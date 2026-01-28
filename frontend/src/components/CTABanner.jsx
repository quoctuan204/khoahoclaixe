import React from 'react'
import { Link } from 'react-router-dom'

const CTABanner = () => {
  return (
    <div className='mt-auto bg-[#135bec] py-16'>
      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center md:flex-row md:text-left sm:px-6 lg:px-8'>
        <div className='max-w-2xl'>
            <h2 className='text-3xl font-bold tracking-tight text-white'>
                Sẵn sàng ngồi sau vô lăng?
            </h2>
            <p className='mt-4 text-lg text-blue-100'>
                Đăng ký ngay hôm nay để nhận ưu đãi giảm giá 500.000đ cho nhóm 3 người.
            </p>
        </div>
        <div className='flex flex-col gap-4 sm:flex-row'>
            <Link to='/dangkykhoahoc' className='cursor-pointer flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-white px-6 font-bold text-[#135bec] transition hover:bg-blue-50'>
                Đăng ký Online
            </Link>
            <button className='cursor-pointer flex h-12 min-w-[160px] items-center justify-center rounded-xl border-2 border-white bg-transparent px-6 font-bold text-white transition hover:bg-white/10'>
                <span className='material-symbols-outlined mr-2'>call</span> 1900 1234
            </button>
        </div>
      </div>
    </div>
  )
}

export default CTABanner
