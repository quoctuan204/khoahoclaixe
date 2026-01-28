import React from 'react'

const Timeframe = () => {
  return (
    <div>
      <div className='relative bg-[#135bec] text-white py-16 lg:py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-cover bg-center opacity-10'
          style={{ backgroundImage: "url('/assets/cubes.png')" }}></div>
        <div className='absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-white/5 pointer-events-none'></div>
        <div className='absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-white/5 pointer-events-none'></div>
        <div className='layout-container flex justify-center relative z-10'>
          <div className='layout-content-container flex flex-col items-center text-center max-w-[900px] w-full px-4 lg:px-10'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6'>
              <span className='material-symbols-outlined text-[#f97316] text-lg'>schedule</span>
              <span>Chủ động thời gian - Vững vàng tay lái</span>
            </div>
            <h1 className='text-4xl lg:text-6xl font-black mb-6 leading-tight'>
              Giờ học linh hoạt <br /> <span className='text-blue-200'>Theo cách của bạn</span>
            </h1>
            <p className='text-lg lg:text-xl text-blue-100 max-w-2xl leading-relaxed'>
              Giải pháp đào tạo lái xe hiện đại dành cho người bận rộn. Tại SafeDrive,
              bạn toàn quyền quyết định thời gian học tập phù hợp nhất với công việc và cuộc sống.
            </p>
          </div>
        </div>
      </div>

      {/* Khung giờ */}
      <div className='py-16 lg:py-20 bg-white'>
        <div className='layout-container flex justify-center'>
          <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
            <div className='text-center mb-16'>
              <h2 className='text-[#111318] text-3xl lg:text-4xl font-black mb-4'>Đa dạng khung giờ học tập</h2>
              <p className='text-gray-600 max-w-2xl mx-auto text-lg'>
                Chúng tôi mở cửa từ 7:00 sáng đến 21:00 tối tất cả các ngày trong tuần, kể cả Thứ 7 và Chủ nhật, không phụ thu phí ngoài giờ.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

              {/* ca sáng */}
              <div className='group bg-background-light p-8 rounded-2xl border border-transparent hover:border-[#135bec]/20 hover:bg-white hover:shadow-xl transition-all duration-300'>
                <div className='w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <span className='material-symbols-outlined text-3xl'>wb_twilight</span>
                </div>
                <h3 className='text-xl font-bold text-[#111318] mb-2'>Ca sáng</h3>
                <p className='text-[#135bec] font-bold text-lg mb-3'>07:00 - 11:00</p>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  Khởi đầu ngày mới tràn đầy năng lượng. Giao thông thông thoáng, dễ dàng tập trung tiếp thu bài học.
                </p>
              </div>

              {/* ca chiều */}
              <div className='group bg-background-light p-8 rounded-2xl border border-transparent hover:border-[#135bec]/20 hover:bg-white hover:shadow-xl transition-all duration-300'>
                <div className='w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <span className='material-symbols-outlined text-3xl'>wb_sunny</span>
                </div>
                <h3 className='text-xl font-bold text-[#111318] mb-2'>Ca chiều</h3>
                <p className='text-[#135bec] font-bold text-lg mb-3'>13:00 - 17:00</p>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  Khung giờ tiêu chuẩn. Phù hợp để làm quen với điều kiện ánh sáng mạnh và mật độ giao thông thực tế.
                </p>
              </div>

              {/* ca tối */}
              <div className='group bg-background-light p-8 rounded-2xl border border-transparent hover:border-[#135bec]/20 hover:bg-white hover:shadow-xl transition-all duration-300'>
                <div className='w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <span className='material-symbols-outlined text-3xl'>nights_stay</span>
                </div>
                <h3 className='text-xl font-bold text-[#111318] mb-2'>Ca tối</h3>
                <p className='text-[#135bec] font-bold text-lg mb-3'>18:00 - 21:00</p>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  Lựa chọn số 1 cho người đi làm. Hệ thống sân tập có đèn chiếu sáng đạt chuẩn, đảm bảo an toàn.
                </p>
              </div>

              {/* Cuối tuần */}
              <div className='group bg-background-light p-8 rounded-2xl border border-transparent hover:border-[#135bec]/20 hover:bg-white hover:shadow-xl transition-all duration-300'>
                <div className='w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <span className='material-symbols-outlined text-3xl'>calendar_month</span>
                </div>
                <h3 className='text-xl font-bold text-[#111318] mb-2'>Cuối tuần</h3>
                <p className='text-[#135bec] font-bold text-lg mb-3'>T7 &amp; Chủ Nhật</p>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  Dành trọn ngày nghỉ để luyện tập liên tục. Thoải mái sắp xếp mà không ảnh hưởng công việc chính.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeframe
