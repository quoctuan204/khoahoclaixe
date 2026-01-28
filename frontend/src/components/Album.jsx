import React from 'react'
import { assets } from '../assets/assets'

const Album = () => {
  return (
    <div className='py-16 lg:py-24 bg-[#f8f9fa]' id='thu-vien'>
      <div className='layout-container flex justify-center'>
        <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
            <div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-4'>
                <div className='max-w-2xl'>
                    <span className='text-[#f97316] font-bold uppercase tracking-wider text-sm'>
                        ALBUM
                    </span>
                    <h2 className='text-[#111318] text-3xl lg:text-4xl font-black mt-2'>
                        Hình ảnh
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        Một số hình ảnh thực tế tại sân tập và các buổi lễ tốt nghiệp của học viên.
                    </p>
                </div>
                <button className='cursor-pointer hidden md:flex items-center gap-2 text-[#135bec] font-bold hover:text-blue-700 transition-colors'>
                    Xem tất cả hình ảnh <span className='material-symbols-outlined'>arrow_forward</span>
                </button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]'>
                <div className='col-span-2 row-span-2 relative group overflow-hidden rounded-2xl'>
                    <img src={assets.album1} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt=""/>
                    <div className='absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors'></div>
                    <div className='absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                        <h3 className='font-bold text-lg'>Giờ học thực hành</h3>
                        <p className='text-sm text-gray-200'>Kèm 1-1 với giáo viên</p>
                    </div>
                </div>

                <div className='col-span-1 row-span-1 relative group overflow-hidden rounded-2xl'>
                    <img src={assets.album2} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt=""/>
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors'></div>
                </div>
                <div className='col-span-1 row-span-1 relative group overflow-hidden rounded-2xl'>
                    <img src={assets.album3} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt=""/>
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors'></div>
                </div>
                <div className='col-span-2 row-span-1 relative group overflow-hidden rounded-2xl'>
                    <img src={assets.album4} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt=""/>
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors'></div>
                    <div className='absolute bottom-4 left-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300'>
                        <h3 className='font-bold text-sm'>Sân sát hạch tiêu chuẩn</h3>
                    </div>
                </div>
            </div>

            <button className='md:hidden mt-6 flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50'>
                Xem thêm hình ảnh
            </button>
        </div>
      </div>
    </div>
  )
}

export default Album
