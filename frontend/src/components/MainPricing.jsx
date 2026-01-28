import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets' 

const MainPricing = () => {
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
            {/* B1 Card */}
            <div className='cursor-pointer group relative flex flex-col rounded-2xl border border-gray-200 bg-[#ffffff] p-8 shadow-sm transition hover:shadow-xl hover:border-[#135bec]/30 dark:border-gray-700 dark:bg-surface-dark'>
                <div className='mb-6'>
                    <h3 className='text-lg font-bold text-[#111318] dark:text-white'>
                        Hạng B1 (Số Tự Động)
                    </h3>
                    <p className='mt-2 text-sm text-[#616f89] dark:text-gray-400'>
                        Dành cho người lái xe gia đình, không kinh doanh.
                    </p>
                </div>
                <div className='mb-6 flex items-baseline gap-1'>
                    <span className='text-4xl font-black tracking-tight text-[#111318] dark:text-white'>12.500.000đ</span>
                    <span className='text-sm font-semibold text-[#616f89] dark:text-gray-500'>/ khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'b1', courseName: 'Hạng B1 - Số tự động', imageKey: assets.b1sotudong }} className='cursor-pointer mb-8 w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-[#111318] transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center'>
                    Đăng ký B1
                </Link> 
                <ul className='flex flex-1 flex-col gap-4'>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Xe tập lái số tự động đời mới 2022+</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Lịch học linh động (Sáng - Chiều - Tối)</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Bao gồm 710km đường trường (DAT)</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Miễn phí 4h tập xe chip</span>
                    </li>
                </ul>
            </div>

            {/* B2 Card */}
            <div className='cursor-pointer relative flex transform flex-col rounded-2xl border-2 border-[#135bec] bg-[#ffffff] p-8 shadow-xl shadow-[#135bec]/10 transition hover:-translate-y-1 dark:bg-surface-dark z-10'>
                <div className='absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-[#f97316] px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm'>
                    Phổ biến nhất
                </div>
                <div className='mb-6'>
                    <h3 className='text-lg font-bold text-[#111318] dark:text-white'>
                        Hạng B2 (Số Sàn)
                    </h3>
                    <p className='mt-2 text-sm text-[#616f89] dark:text-gray-400'>
                        Lái xe số sàn &amp; tự động, được phép kinh doanh.
                    </p>
                </div>
                <div className='mb-6 flex items-baseline gap-1'>
                    <span className='text-4xl font-black tracking-tight text-[#135bec]'>14.000.000đ</span>
                    <span className='text-sm font-semibold text-[#616f89] dark:text-gray-500'>/ Khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'b2', courseName: 'Hạng B2 - Số sàn', imageKey: assets.toyotavios }} className='cursor-pointer mb-8 w-full rounded-xl bg-[#135bec] py-3 text-sm font-bold text-white shadow-lg shadow-[#135bec]/25 transition hover:bg-[#135bec]/90 flex items-center justify-center'>
                    Đăng ký B2 Ngay
                </Link> 
                <ul className='flex flex-1 flex-col gap-4'>
                    <li className='flex items-start gap-3 text-sm text-[#111318] font-medium dark:text-white'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Xe Vios/Accent đời mới, máy lạnh</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#111318] font-medium dark:text-white'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Chạy đủ 810km DAT theo quy định</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#111318] font-medium dark:text-white'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Bao trọn gói lệ phí thi, bằng lái</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#111318] font-medium dark:text-white'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Hỗ trợ học Lý thuyết Online tại nhà</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#111318] font-medium dark:text-white'>
                        <span className='material-symbols-outlined text-[#f97316]'>verified</span>
                        <span className='text-[#f97316] font-bold'>Tặng 1h bổ túc tay lái</span>
                    </li>
                </ul>
            </div>

            {/* C Card */}
            <div className='cursor-pointer group relative flex flex-col rounded-2xl border border-gray-200 bg-[#ffffff] p-8 shadow-sm transition hover:shadow-xl hover:border-[#135bec]/30 dark:border-gray-700 dark:bg-surface-dark'>
                <div className='mb-6'>
                    <h3 className='text-lg font-bold text-[#111318] dark:text-white'>
                        Hạng C (Xe Tải)
                    </h3>
                    <p className='mt-2 text-sm text-[#616f89] dark:text-gray-400'>
                        Dành cho người lái xe tải trên 3.5 tấn.
                    </p>
                </div>
                <div className='mb-6 flex items-baseline gap-1'>
                    <span className='text-4xl font-black tracking-tight text-[#111318] dark:text-white'>
                        16.500.000đ
                    </span>
                    <span className='text-sm font-semibold text-[#616f89] dark:text-gray-500'>/ Khóa</span>
                </div>
                <Link to='/dangkykhoahoc' state={{ course: 'c', courseName: 'Hạng C - Xe tải', imageKey: assets.c1xetai }} className='cursor-pointer mb-8 w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-[#111318] transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center'>
                    Đăng ký Hạng C
                </Link> 
                <ul className='flex flex-1 flex-col gap-4'>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Học xe tải ISUZU/THACO mới</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Giáo viên kinh nghiệm 10+ năm</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Hỗ trợ chỗ ở cho học viên ở xa</span>
                    </li>
                    <li className='flex items-start gap-3 text-sm text-[#616f89] dark:text-gray-300'>
                        <span className='material-symbols-outlined text-[#135bec]'>check_circle</span>
                        <span>Thời gian đào tạo nhanh (5.5 tháng)</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default MainPricing
