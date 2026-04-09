import React from 'react'

const LearningPath = () => {
  return (
    <div className='px-4 py-16 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center bg-blue-50/50'>
      <div className='flex flex-col max-w-[960px] flex-1'>
        <h2 className='text-[#111318] text-3xl font-bold leading-tight tracking-[-0.015em] pb-10 text-center'>
            Lộ trình đào tạo chuẩn <span className='text-[#135bec]'>4 Bước</span>
        </h2>

        <div className='relative'>
            {/* Connecting Line (Desktop) */}
            <div className='hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0'></div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10'>
                {/* Step 1 */}
                <div className='flex flex-col items-center text-center gap-4'>
                    <div className='w-16 h-16 rounded-full bg-white border-4 border-[#135bec] text-[#135bec] flex items-center justify-center shadow-lg'>
                        <span className='material-symbols-outlined text-3xl'>menu_book</span>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg text-[#111318]'>Lý thuyết</h3>
                        <p className='text-sm text-gray-500 mt-2'>
                            Học luật GTĐB, biển báo và cấu tạo xe. Thi thử trên phần mềm.
                        </p>
                    </div>
                </div>
                {/* Step 2 */}
                <div className='flex flex-col items-center text-center gap-4'>
                    <div className='w-16 h-16 rounded-full bg-white border-4 border-[#135bec] text-[#135bec] flex items-center justify-center shadow-lg'>
                        <span className='material-symbols-outlined text-3xl'>sports_esports</span>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg text-[#111318]'>Mô phỏng</h3>
                        <p className='text-sm text-gray-500 mt-2'>
                            Tập lái trên cabin mô phỏng 3D các tình huống giao thông.
                        </p>
                    </div>
                </div>
                {/* Step 3 */}
                <div className='flex flex-col items-center text-center gap-4'>
                    <div className='w-16 h-16 rounded-full bg-white border-4 border-[#135bec] text-[#135bec] flex items-center justify-center shadow-lg'>
                        <span className='material-symbols-outlined text-3xl'>directions_car_filled</span>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg text-[#111318]'>Thực hành</h3>
                        <p className='text-sm text-gray-500 mt-2'>
                            Lái xe trong sa hình và đường trường thực tế (DAT 810km).
                        </p>
                    </div>
                </div>
                {/* Step 4 */}
                <div className='flex flex-col items-center text-center gap-4'>
                    <div className='w-16 h-16 rounded-full bg-white border-4 border-[#135bec] text-[#135bec] flex items-center justify-center shadow-lg'>
                        <span className='material-symbols-outlined text-3xl'>school</span>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg text-[#111318]'>Sát hạch</h3>
                        <p className='text-sm text-gray-500 mt-2'>
                            Thi tốt nghiệp và sát hạch cấp bằng lái xe quốc gia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LearningPath
