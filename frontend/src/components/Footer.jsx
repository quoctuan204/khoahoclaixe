import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [settings, setSettings] = useState({
    centerName: 'Trường dạy lái xe',
    address: 'GJQ2+345 Cần Đước, Long An, Việt Nam',
    hotline: '0987654321',
    email: 'trungtamlaixe@gmail.com',
    facebook: '',
    zalo: ''
  })

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`).then(res => res.json()).then(data => setSettings(prev => ({...prev, ...data}))).catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="bg-black text-white pt-16 pb-8 relative z-20">
            <div className="layout-container flex justify-center">
                <div className="layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center justify-center rounded bg-white p-1 text-black">
                                    <span className="material-symbols-outlined text-2xl">
                                        directions_car
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {settings.centerName}
                                </h2>
                            </div>

                            <p className="text-sm text-slate-300 max-w-sm">
                                Trung tâm đào tạo lái xe với đội ngũ giảng viên chuyên nghiệp và phương tiện hiện đại. Hỗ trợ tư vấn 24/7.
                            </p>
                            <div className='flex gap-4 mt-2'>
                                <a className='w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors' href={settings.facebook || '#'} target="_blank" rel="noreferrer">
                                    <span className='material-symbols-outlined text-[18px]'>public</span>
                                </a>
                                <a className='w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors' href={`mailto:${settings.email}`}>
                                    <span className='material-symbols-outlined text-[18px]'>mail</span>
                                </a>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h3 className='text-lg font-bold'>Về chúng tôi</h3>
                            <div className='flex flex-col gap-2 text-gray-400 text-sm'>
                                <Link className='hover:text-white transition-colors' to="/gioi_thieu">Giới thiệu</Link>
                                <Link className='hover:text-white transition-colors' to="#">Đội ngũ giáo viên</Link>
                                <Link className='hover:text-white transition-colors' to="/hethongxetaplai">Cơ sở vật chất</Link>
                                <Link className='hover:text-white transition-colors' to="#">Tuyển dụng</Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h3 className='text-lg font-bold'>Khóa học</h3>
                            <div className='flex flex-col gap-2 text-gray-400 text-sm'>
                                <Link className='hover:text-white transition-colors' to="/product/b1-sotudong">Hạng B1 số tự động</Link>
                                <Link className='hover:text-white transition-colors' to="/product/b2-sosan">Hạng B2 số sàn</Link>
                                <Link className='hover:text-white transition-colors' to="/product/c-xetai">Hạng C xe tải</Link>
                                <Link className='hover:text-white transition-colors' to="/lien_he">Bổ túc tay lái</Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h3 className='text-lg font-bold'>Liên hệ</h3>
                            <div className='flex flex-col gap-3 text-gray-400 text-sm'>
                                <div className='flex gap-3'>
                                    <span className='material-symbols-outlined text-primary text-[20px]'>location_on</span>
                                    <span>{settings.address}</span>
                                </div>
                                <div className='flex gap-3'>
                                    <span className='material-symbols-outlined text-primary text-[20px]'>call</span>
                                    <span>{settings.hotline}</span>
                                </div>
                                <div className='flex gap-3'>
                                    <span className='material-symbols-outlined text-primary text-[20px]'>mail</span>
                                    <span>{settings.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-gray-500 text-sm text-center md:text-left'>
                            © 2026 Trung tâm sát hạch. All rights reserved.
                        </p>
                        <div className='flex gap-6 text-gray-500 text-sm'>
                            <a className='hover:text-white transition-colors' href="#">Điều khoản sử dụng</a>
                            <a className='hover:text-white transition-colors' href="#">Chính sách bảo mật</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
