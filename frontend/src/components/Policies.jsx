import React from 'react'

const Policies = () => {
  return (
    <div className='py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            {/* Chính sách trả góp */}
            <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#135bec]/10 text-[#135bec]'>
                        <span className='material-symbols-outlined text-2xl'>credit_score</span>
                    </div>
                    <h3 className='text-2xl font-bold text-[#111318] dark:text-white'>
                        Chính Sách Thanh Toán
                    </h3>
                </div>
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-surface-dark'>
                    <h4 className='mb-4 text-lg font-bold text-[#135bec]'>
                        Chia nhỏ học phí làm 2-3 đợt
                    </h4>
                    <ul className='space-y-4'>
                        <li className='flex gap-4'>
                            <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-bold text-[#f97316]'>1</div>
                            <div>
                                <p className='font-semibold text-[#111318] dark:text-white'>Đợt 1: Đăng ký hồ sơ</p>
                                <p className='text-sm text-[#616f89] dark:text-gray-400'>
                                    Đóng trước 4.000.000đ - 6.000.000đ để hoàn thiện hồ sơ pháp lý và xếp lớp học ngay.
                                </p>
                            </div>
                        </li>
                        <li className='flex gap-4'>
                            <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-bold text-[#f97316]'>2</div>
                            <div>
                                <p className='font-semibold text-[#111318] dark:text-white'>Đợt 2: Khi bắt đầu học DAT</p>
                                <p className='text-sm text-[#616f89] dark:text-gray-400'>
                                    Hoàn thành phần học phí còn lại trước khi chạy đường trường.
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className='mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20'>
                        <p className='flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400'>
                            <span className='material-symbols-outlined text-lg'>verified</span>
                            Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng
                        </p>
                    </div>
                </div>
            </div>

            {/* Thông tin minh bạch */}
            <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#135bec]/10 text-[#135bec]'>
                        <span className='material-symbols-outlined text-2xl'>info</span>
                    </div>
                    <h3 className='text-2xl font-bold text-[#111318] dark:text-white'>Minh Bạch Các Khoản Phí</h3>
                </div>
                <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-surface-dark'>
                    <p className='mb-4 text-[#616f89] dark:text-gray-400'>
                        Chúng tôi cam kết trọn gói bao gồm: Xăng xe, công thầy, bến bãi, tài liệu. Tuy nhiên, học viên cần lưu ý các khoản
                        phí <span className='font-bold text-[#111318] dark:text-white'>nộp trực tiếp tại sân thi</span> (theo quy định nhà nước):
                    </p>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                            <span className='material-symbols-outlined text-[#f97316] mt-0.5'>warning</span>
                            <div>
                                <p className='text-sm font-bold text-[#111318] dark:text-white'>Lệ phí thi sát hạch</p>
                                <p className='text-xs text-[#616f89] dark:text-gray-400'>Khoảng 600.000đ (Nộp tại sở GTVT hôm thi)</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                            <span className='material-symbols-outlined text-[#f97316] mt-0.5'>warning</span>
                            <div>
                                <p className='text-sm font-bold text-[#111318] dark:text-white'>Lệ phí cấp bằng PET</p>
                                <p className='text-xs text-[#616f89] dark:text-gray-400'>135.000đ (Nộp khi đậu)</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                            <span className='material-symbols-outlined text-[#f97316] mt-0.5'>add_circle</span>
                            <div>
                                <p className='text-sm font-bold text-[#111318] dark:text-white'>Thuê xe chip (tùy chọn)</p>
                                <p className='text-xs text-[#616f89] dark:text-gray-400'>300k - 350k/giờ (Luyện tập thêm trước ngày thi)</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                            <span className='material-symbols-outlined text-[#f97316] mt-0.5'>medical_services</span>
                            <div>
                                <p className='text-sm font-bold text-[#111318] dark:text-white'>Khám sức khỏe</p>
                                <p className='text-xs text-[#616f89] dark:text-gray-400'>Khoảng 300.000đ (Tại bệnh viện quận/huyện)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Policies
