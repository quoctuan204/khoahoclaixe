import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const RegisterForTheCourse = () => {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')
  const [imageSrc, setImageSrc] = useState(assets.b1sotudong)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    course: '',
    cccd: '',
    address: '',
    note: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataToSend = { ...formData, course: selectedCourse, courseName: selectedCourseName }
    try {
      const response = await fetch(`${API_BASE}/api/register-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      if (response.ok) {
        toast.success('Đăng ký thành công! Trung tâm đã nhận được hồ sơ và sẽ liên hệ lại với bạn sớm nhất.')
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          dob: '',
          gender: '',
          course: '',
          cccd: '',
          address: '',
          note: ''
        })
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const normalizeCourseKey = (c) => {
    if (!c) return ''
    if (typeof c === 'string'){
      if (c.startsWith('b1')) return 'b1'
      if (c.startsWith('b2')) return 'b2'
      if (c.startsWith('c')) return 'c'
    }
    return ''
  }

  useEffect(() => {
    const s = location.state || {}
    if (s.course) {
      const key = normalizeCourseKey(s.course)
      setSelectedCourse(key)
      setSelectedCourseName(s.courseName || mapCourseToName(key))
      setImageSrc(s.imageKey || mapCourseToImage(key))
      setFormData(prev => ({ ...prev, course: key }))
    }
  }, [location.state])

  const mapCourseToName = (c) => {
    if (c === 'b1') return 'Hạng B1 - Số tự động'
    if (c === 'b2') return 'Hạng B2 - Số sàn'
    if (c === 'c') return 'Hạng C - Xe tải'
    if (typeof c === 'string') return c
    return ''
  }

  const mapCourseToImage = (c) => {
    if (c === 'b1') return assets.b1sotudong
    if (c === 'b2') return assets.toyotavios
    if (c === 'c') return assets.c1xetai
    return assets.b1sotudong
  }

  const handleCourseChange = (e) => {
    const v = e.target.value
    setSelectedCourse(v)
    setSelectedCourseName(mapCourseToName(v))
    setImageSrc(mapCourseToImage(v))
    setFormData(prev => ({ ...prev, course: v }))
  }

  return (
    <div className='flex-grow w-full'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
            {/* Left Column */}
            <div className='lg:col-span-5 lg:sticky lg:top-24 space-y-8'>
                <div className='space-y-4'>
                    <h1 className='text-4xl md:text-5xl font-black tracking-tight text-[#111318] dark:text-white leading-[1.1]'>
                        Hành trình lái xe an toàn bắt đầu tại đây.
                    </h1>
                    <p className='text-lg text-[#616f89] dark:text-gray-400 leading-relaxed'>
                        Tham gia cộng đồng hơn 5,000 học viên đã tốt nghiệp. Chúng tôi cam kết đào tạo kỹ năng lái xe 
                        vững vàng, tự tin xử lý mọi tình huống.
                    </p>

                    <div className='relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg group'>
                        <img src={imageSrc} className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105' alt={selectedCourseName || 'Xe học'} />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10'></div>
                        <div className='absolute bottom-4 left-4 z-20 text-white'>
                            <p className='font-bold text-lg'>{selectedCourseName || 'Học thực hành 1 kèm 1'}</p>
                            <p className='text-sm opacity-90'>{selectedCourse ? 'Xe thực hành theo hạng' : 'Xe đời mới, có máy lạnh'}</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className='space-y-4'>
                        <li className='flex items-start gap-3'>
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318] dark:text-gray-200'>
                                Cam kết không phát sinh chi phí phụ.
                            </span>
                        </li>

                        <li className='flex items-start gap-3'>
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318] dark:text-gray-200'>
                                Lịch học linh hoạt
                            </span>
                        </li>

                        <li className='flex items-start gap-3'>
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318] dark:text-gray-200'>
                                Hỗ trợ làm hồ sơ thi sát hạch trọn gói.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Column */}
            <div className='lg:col-span-7'>
                <div className='bg-[#ffffff] dark:bg-[#1a2332] rounded-2xl shadow-xl border border-[#dbdfe6] dark:border-[#2a3441] p-6 sm:p-8 lg:p-10'>
                    <div className='mb-8 border-b border-[#dbdfe6] dark:border-[#2a3441] pb-6'>
                        <h2 className='text-2xl font-bold text-[#111318] dark:text-white mb-2'>
                            Thông tin đăng ký
                        </h2>
                        <p className='text-[#616f89] dark:text-gray-400 text-sm'>
                            Vui lòng điền đầy đủ thông tin bên dưới để giữ chỗ.
                        </p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Name Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label 
                                    className='block text-sm font-medium text-[#111318] dark:text-gray-200'
                                    for='lastname'>
                                        Họ <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
                                    id='lastname'
                                    placeholder='Họ'
                                    type="text"
                                    name='lastName'
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required/>
                            </div>

                            <div className='space-y-2'>
                                <label 
                                    className='block text-sm font-medium text-[#111318] dark:text-gray-200'
                                    for='lastname'>
                                        Tên <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
                                    id='firstname'
                                    placeholder='Tên'
                                    type="text"
                                    name='firstName'
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required/>
                            </div>
                        </div>

                        {/* Contact Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='email'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]'>
                                        <span className='material-symbols-outlined text-[20px]'>mail</span>
                                    </div>
                                    <input
                                        className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 pl-10 pr-4 placeholder:text-[#616f89]/60'
                                        id='email'
                                        placeholder='example@email.com' 
                                        type="email"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required/>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='email'>
                                    Số điện thoại <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]'>
                                        <span className='material-symbols-outlined text-[20px]'>call</span>
                                    </div>
                                    <input
                                        className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 pl-10 pr-4 placeholder:text-[#616f89]/60'
                                        id='phone'
                                        placeholder='+84'
                                        type="tel"
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required/>
                                </div>
                            </div>
                        </div>

                        {/* Course Selection */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='course'>
                                Chọn khóa học
                            </label>
                            <div className='relative'>
                                <select 
                                    className='w-full appearance-none rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-14 px-4 pr-10' 
                                    id="course" value={selectedCourse} onChange={handleCourseChange}>
                                        <option disabled value="">Vui lòng chọn khóa học...</option>
                                        <option value="b1">Hạng B1 - Số tự động (Khuyên dùng cho gia đình)</option>
                                        <option value="b2">Hạng B2 - Số sàn (Chuyên nghiệp)</option>
                                        <option value="c">Hạng C - Xe tải (Trên 3.5 tấn)</option>   
                                </select>
                                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#616f89]'>
                                    <span className='material-symbols-outlined text-[24px]'>
                                        expand_more
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Address & ID */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='cccd'>
                                    Số CCCD/CMND
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
                                    id='cccd'
                                    placeholder='cccd/cmnd'
                                    type="text"
                                    name='cccd'
                                    value={formData.cccd}
                                    onChange={handleInputChange}/>
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='cccd'>
                                    Địa chỉ thường trú
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
                                    id='address'
                                    placeholder='Quận/Huyện, Tỉnh/Thành phố'
                                    type="text"
                                    name='address'
                                    value={formData.address}
                                    onChange={handleInputChange}/>
                            </div>
                        </div>

                        {/* Additional Note (Optional) */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-[#111318] dark:text-gray-200' for='note'>
                                Ghi chú thêm
                            </label>
                            <textarea 
                                className='w-full rounded-lg border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#101622]/50 text-[#111318] dark:text-white shadow-sm focus:border-[#135bec] focus:ring-[#135bec] px-4 py-3 placeholder:text-[#616f89]/60 resize-none'
                                id='note'
                                placeholder='Ví dụ: Tôi muốn học vào cuối tuần...'
                                rows="3"
                                name='note'
                                value={formData.note}
                                onChange={handleInputChange}>
                            </textarea>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-4'>
                            {!isAdmin ? (
                                <>
                                    <button className='group relative flex w-full justify-center rounded-lg border border-transparent bg-[#135bec] py-4 px-4 text-base font-bold text-white hover:bg-[#0f4bc4] focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:ring-offset-2 transition-all shadow-lg shadow-[#135bec]/30' type="submit">
                                        <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                            <span className='material-symbols-outlined group-hover:animate-pulse'>
                                                how_to_reg
                                            </span>
                                        </span>
                                        Đăng ký ngay
                                    </button>
                                    <p className='mt-4 text-center text-xs text-[#616f89] dark:text-gray-400'>
                                        Bằng việc nhấp vào nút Đăng ký, bạn đồng ý với <a className='text-[#135bec] hover:underline' href="#">Điều khoản dịch vụ</a> và <a className='text-[#135bec] hover:underline' href="#">Chính sách bảo mật</a> của chúng tôi.
                                    </p>
                                </>
                            ) : (
                                <div className='w-full py-4 text-center text-gray-500 bg-gray-100 rounded-lg border border-gray-200 font-medium'>
                                    Bạn đang ở chế độ Admin (Ẩn nút đăng ký)
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterForTheCourse
