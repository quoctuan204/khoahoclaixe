import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 

const Pricing = () => {
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
            {/* B1 Card */}
            <div className='relative flex flex-col gap-6 rounded-2xl border-2 border-primary bg-white dark:bg-[#232b3a] p-8 shadow-xl transform scale-105 z-10 md:order-2 lg:order-1 lg:scale-100 lg:border-gray-200 lg:dark:border-gray-700 lg:shadow-none lg:z-0'>
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-[#135bec] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm'>
                    Phổ biến nhất
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-[#111318] dark:text-white text-xl font-bold'>Hạng B1 (Số tự động)</h3>
                        <span className='material-symbols-outlined text-gray-400'>directions_car</span>
                    </div>

                    <p className='text-[#616f89] dark:text-gray-400 text-sm'>Phù hợp cho nữ giới và gia đình.</p>
                </div>
                <div className='flex items-baseline gap-1'>
                    <span className='text-[#135bec] text-4xl font-black tracking-tight'>12.500.000đ</span>
                    <span className='text-gray-500 text-sm font-medium'>/ Khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'b1', courseName: 'Hạng B1 - Số tự động', imageKey: assets.b1sotudong }} className='w-full cursor-pointer rounded-lg h-12 bg-[#135bec] text-white text-base font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center'>
                    Đăng ký B1 ngay
                </Link> 
                
                <div className='flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700 pt-6'>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Chỉ lái xe số tự động, không kinh doanh</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Học 1 kèm 1 với giáo viên kinh nghiệm</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Thời gian đào tạo: 2.5 - 3 tháng</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Bao trọn gói xăng xe, sân tập</span>
                    </div>
                </div>
            </div>

            {/* B2 Card */}
            <div className='relative flex flex-col gap-6 rounded-2xl border-2 border-[#135bec] bg-white dark:bg-[#232b3a] p-8 shadow-2xl z-20 md:order-1 lg:order-2 transform lg:-translate-y-4 min-h-[280px] overflow-hidden'>
                <div className='absolute top-0 right-0 bg-[#135bec]/10 text-[#135bec] px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold uppercase tracking-wide'>
                    Được chọn nhiều
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-[#111318] dark:text-white text-xl font-bold'>Hạng B2 (Số sàn)</h3>
                        <span className='material-symbols-outlined text-[#135bec]'>local_shipping</span>
                    </div>

                    <p className='text-[#616f89] dark:text-gray-400 text-sm'>Cho người muốn kinh doanh vận tải.</p>
                </div>

                <div className='flex items-baseline gap-1 flex-wrap'>
                    <span className='text-[#f97316] text-3xl md:text-4xl font-black tracking-tight break-words'>14.000.000đ</span>
                    <span className='text-gray-500 text-sm font-medium'>/ Khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'b2', courseName: 'Hạng B2 - Số sàn', imageKey: assets.toyotavios }} className='w-full cursor-pointer rounded-lg h-12 bg-[#f97316] text-white text-base font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 ring-2 ring-offset-2 ring-accent ring-offset-white dark:ring-offset-[#1a202c] flex items-center justify-center'>
                    Đăng ký B2 ngay
                </Link> 
                <div className='flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700 pt-6'>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Lái được cả số sàn và số tự động</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Đủ điều kiện lái xe taxi, grab, dịch vụ</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Học lý thuyết &amp; thực hành song song</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Thời gian đào tạo: 3.5 tháng</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Thực hành đường trường 800km</span>
                    </div>
                </div>
            </div>

            {/* C Card */}
            <div className='relative flex flex-col gap-6 rounded-2xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#232b3a] p-8 shadow-sm hover:shadow-lg transition-shadow md:order-3 lg:order-3'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-[#111318] dark:text-white text-xl font-bold'>
                            Hạng C (Xe tải)
                        </h3>
                        <span className='material-symbols-outlined text-gray-400'>agriculture</span>
                    </div>
                    <p className='text-[#616f89] dark:text-gray-400 text-sm'>Dành cho lái xe tải chuyên nghiệp.</p>
                </div>

                <div className='flex items-baseline gap-1'>
                    <span className='text-[#111318] dark:text-white text-4xl font-black tracking-tight'>
                        16.500.000đ
                    </span>
                    <span className='text-gray-500 text-sm font-medium'>/ Khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'c', courseName: 'Hạng C - Xe tải', imageKey: assets.isuzuQKR }} className='w-full cursor-pointer rounded-lg h-12 bg-[#f0f2f4] dark:bg-gray-700 text-[#111318] dark:text-white text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center'>
                    Đăng ký hạng C
                </Link> 
                <div className='flex flex-col gap-4 border-t border-gray-100 dark:border-gray-700 pt-6'>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Lái xe tải trên 3.5 tấn</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Bao gồm quyền lợi hạng B1, B2</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Hỗ trợ nâng hạng D, E sau này</span>
                    </div>
                    <div className='flex gap-3 text-sm text-[#111318] dark:text-gray-200 items-start'>
                        <span className='material-symbols-outlined text-green-500 text-[20px]'>check</span>
                        <span>Thời gian đào tạo: 5.5 - 6 tháng</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
