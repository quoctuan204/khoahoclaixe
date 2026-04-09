import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { cars } from '../data/cars' 

const DrivingPracticeCar = () => {
    const [filter, setFilter] = useState('all')

    const filteredCars = cars.filter(car => {
        if (filter === 'all') return true
        if (filter === 'AT') return car.transmission === 'AT'
        if (filter === 'MT') return car.transmission === 'MT'
        return true
    })

    return (
        <div> 
            <div className='bg-white border-b border-gray-100'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container w-full max-w-[1280px] px-4 py-3 lg:px-10'>
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <a className='hover:text-[#135bec] transition-colors' href="/">Trang chủ</a>
                            <span className='material-symbols-outlined text-[16px]'>chevron_right</span>
                            <span className='text-[#135bec] font-medium'>Hệ thống xe tập lái</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* banner */}
            <div className='relative w-full'>
                <div className='layout-container flex w-full justify-center'>
                    <div className='layout-content-container flex w-full max-w-[1280px] flex-col px-4 py-6 lg:px-10 lg:py-10'>
                        <div 
                            className='relative overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat min-h-[400px] lg:min-h-[500px] flex items-center justify-center text-center p-6 lg:p-16 shadow-lg'
                            style={{ backgroundImage: `url(${assets.bannerxetaplai})` }}
                            >
                            <div className='flex flex-col gap-6 max-w-[800px] items-center animate-fade-in-up'>
                                <div className='inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-bold text-white uppercase tracking-wider shadow-sm'>
                                    <span className='material-symbols-outlined text-[18px] text-[#f97316]'>new_releases</span>
                                    Dàn xe đời mới 2022 - 2024
                                </div>
                                <h1 className='text-white text-3xl lg:text-6xl font-black leading-tight tracking-tight'>
                                    Hệ Thống Xe Tập Lái <br /> <span className='text-[#f97316]'>Chuẩn 5 Sao</span>
                                </h1>
                                <p className='text-gray-100 text-base lg:text-xl font-normal leading-relaxed max-w-[640px]'>
                                    Trải nghiệm học lái xe trên những dòng xe hiện đại, an toàn và tiện nghi bậc nhất.
                                    Chúng tôi hiểu rằng, chiếc xe tốt là người bạn đồng hành tin cậy cho những bài học đầu tiên.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh mục phương tiện */}
            <div className='bg-[#f8f9fa] py-16 lg:py-24' id='cac-dong-xe'>
                <div className='layout-container flex justify-center'>
                    <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
                        <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
                            <div>
                                <span className='text-[#f97316] font-bold uppercase tracking-wider text-sm'>Danh mục phương tiện</span>
                                <h2 className='text-[#111318] text-3xl lg:text-4xl font-black mt-2'>Các dòng xe tập lái nổi bật</h2>
                                <p className='text-gray-600 mt-4 max-w-2xl'>
                                    Đa dạng các dòng xe từ số sàn đến số tự động, từ xe con đến xe tải, 
                                    đáp ứng mọi nhu cầu học bằng lái của học viên.
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm ${filter === 'all' ? 'bg-[#135bec] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#135bec] hover:text-[#135bec]'}`}
                                    onClick={() => setFilter('all')}
                                >
                                    Tất cả
                                </button>
                                <button
                                    className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm ${filter === 'AT' ? 'bg-[#135bec] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#135bec] hover:text-[#135bec]'}`}
                                    onClick={() => setFilter('AT')}
                                >
                                    Số tự động
                                </button>
                                <button
                                    className={`cursor-pointer px-4 py-2 rounded-full font-medium text-sm ${filter === 'MT' ? 'bg-[#135bec] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#135bec] hover:text-[#135bec]'}`}
                                    onClick={() => setFilter('MT')}
                                >
                                    Số sàn
                                </button>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {filteredCars.map(car => (
                                <div key={car.id} className='group bg-white rounded-2xl overflow-hidden transition-all border border-gray-200 hover:border-[#135bec]'>
                                    <div className='relative h-64 overflow-hidden'>
                                        <div className='absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase'>
                                            {car.tag}
                                        </div>
                                        <img src={car.img} className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' alt=''/>
                                    </div>
                                    <div className='p-6'>
                                        <h3 className='text-xl font-bold text-[#111318] mb-1'>{car.title}</h3>
                                        <p className='text-gray-500 text-sm mb-4'>{car.desc}</p>
                                        <div className='flex flex-wrap gap-2 mb-6'>
                                            {car.features.map((f, i) => <span key={i} className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded'>{f}</span>)}
                                        </div>
                                        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                <span className='material-symbols-outlined text-[18px]'>engineering</span>
                                                <span>Bảo dưỡng: {car.maintenance}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DrivingPracticeCar
