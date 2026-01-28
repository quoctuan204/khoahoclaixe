import React from 'react'
import SmartLink from './SmartLink'

const Features = () => {
  return (
    <div className='bg-white py-12 lg:py-20'>
      <div className='layout-container flex justify-center'>
        <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
                <div className='flex flex-col gap-3 max-w-[700px]'>
                    <span className='text-orange-500 font-bold uppercase tracking-wider text-sm'>Vì sao chọn chúng tôi</span>
                    <h2 className='text-[#111318] text-3xl lg:text-4xl font-black leading-tight'>
                        Ưu điểm vượt trội
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Chúng tôi cam kết mang lại môi trường học tập tốt nhất, minh bạch và hiệu quả cho mọi học viên.
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {/* Feature 1 */}
                <SmartLink to="/tiledau" className='group cursor-pointer flex flex-col gap-4 rounded-2xl border border-[#dbdfe6] bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1'>
                    <div className='flex items-center justify-center w-14 h-14 rounded-full bg-blue-400 text-white group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                        <span className='material-symbols-outlined text-[32px]'>verified</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-[#111318] text-xl font-bold'>Tỉ lệ đậu 99%</h3>
                        <p className='text-gray-500 leading-relaxed'>
                            Giáo trình bám sát thực tế, mẹo học lý thuyết dễ nhớ giúp học viên tự tin vượt qua kỳ thi.
                        </p>
                    </div>
                </SmartLink>

                {/* Feature 2 */}
                <SmartLink to="/hethongxetaplai" className='group cursor-pointer flex flex-col gap-4 rounded-2xl border border-[#dbdfe6] bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1'>
                    <div className='flex items-center justify-center w-14 h-14 rounded-full bg-blue-400 text-white group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                        <span className='material-symbols-outlined text-[32px]'>directions_car</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-[#111318] text-xl font-bold'>Xe tập đời mới</h3>
                        <p className='text-gray-500 leading-relaxed'>
                            Dàn xe Vios, Accent đời 2022+ sạch sẽ, máy lạnh mát rượi, trang bị cảm biến an toàn.
                        </p>
                    </div>
                </SmartLink>

                {/* Feature 3 */}
                <SmartLink to="/giohoc" className='group cursor-pointer flex flex-col gap-4 rounded-2xl border border-[#dbdfe6] bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1'>
                    <div className='flex items-center justify-center w-14 h-14 rounded-full bg-blue-400 text-white group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                        <span className='material-symbols-outlined text-[32px]'>schedule</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-[#111318] text-xl font-bold'>Giờ học linh hoạt</h3>
                        <p className='text-gray-500 leading-relaxed'>
                            Học viên chủ động chọn lịch học qua App, phù hợp với người đi làm bận rộn.
                        </p>
                    </div>
                </SmartLink>

                {/* Feature 4 */}
                <SmartLink to="/chinhsachhocphi" className='group cursor-pointer flex flex-col gap-4 rounded-2xl border border-[#dbdfe6] bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1'>
                    <div className='flex items-center justify-center w-14 h-14 rounded-full bg-blue-400 text-white group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                        <span className='material-symbols-outlined text-[32px]'>account_balance_wallet</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h3 className='text-[#111318] text-xl font-bold'>Học phí trọn gói</h3>
                        <p className='text-gray-500 leading-relaxed'>
                            Cam kết bằng hợp đồng pháp nhân, không phát sinh bất kỳ chi phí ngầm nào.
                        </p>
                    </div>
                </SmartLink>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Features
