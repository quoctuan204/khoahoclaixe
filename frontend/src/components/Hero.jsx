import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import SmartLink from './SmartLink' 

const Hero = () => {
  const images = [assets.heroImg, assets.heroImg2, assets.heroImg3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative w-full'>
    <div className='layout-container flex w-full'>
        <div className='layout-content-container flex w-full flex-col'>
                <div className='relative overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center justify-start p-6 lg:p-16 shadow-lg'>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-2000 ${index === currentIndex ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}`}
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}

                    <div className='absolute inset-0 bg-black opacity-30'></div>

                    <div className='flex flex-col gap-6 max-w-[640px] text-left animate-fade-in-up relative z-1'>
                      <div className='inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm'>
                        <span className='material-symbols-outlined text-[16px] text-white'>verified</span>
                        Uy tín hàng đầu
                      </div>

                      <h1 className='text-white text-4xl lg:text-6xl font-black leading-tight tracking-[-0.033em]'>
                        Vững tay lái <br/> <span className='text-primary-300'>Trọn Niềm Tin</span>
                      </h1>

                      <h2 className='text-gray-100 text-base lg:text-lg font-normal leading-relaxed max-w-[540px]'>
                        Trung tâm đào tạo lái xe chuẩn quốc tế với đội ngũ giáo viên giàu kinh nghiệm, xe tập đời mới và cam kết tỉ lệ đậu lên đến 99%.
                      </h2>

                      <div className='flex flex-wrap gap-4 mt-4'>
                        <SmartLink to="/lien_he" className='flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-blue-500 hover:bg-blue-700 text-white text-base font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/50'>
                          <span className='truncate'>Đăng ký tư vấn</span>
                          <span className='material-symbols-outlined ml-2 text-[20px]'>arrow_forward</span>
                        </SmartLink>
                        <SmartLink to="/khoa_hoc" className='flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-base font-bold transition-all'>
                          <span className='truncate'>Tìm hiểu khóa học</span>
                        </SmartLink>
                      </div>

                      <div className='flex gap-6 mt-6 pt-6 border-t border-white/20'>
                        <div className='flex flex-col text-white'>
                          <span className='font-bold text-2xl'>10.000+</span>
                          <span className='text-sm text-gray-300'>Học viên tốt nghiệp</span>
                        </div>

                        <div className='flex flex-col text-white'>
                          <span className='font-bold text-2xl'>99%</span>
                          <span className='text-sm text-gray-300'>Tỉ lệ đậu sát hạch</span>
                        </div>
                      </div>

                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Hero
