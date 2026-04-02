import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Registration = () => {
  const { isAdmin } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    course: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/contact-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Đăng ký thành công! Chúng tôi sẽ liên hệ lại trong vòng 30 phút.')
        setFormData({ fullname: '', phone: '', course: '' })
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng kiểm tra kết nối.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-primary relative' id='lien-he'>
      <div className='layout-container flex justify-center bg-blue-800/90'>
        <div className='layout-content-container flex flex-col lg:flex-row gap-12 max-w-[1280px] w-full px-4 lg:px-10 items-center pt-16 pb-16'>
                <div className='flex-1 text-white'>
                    <h2 className='text-3xl lg:text-5xl font-black mb-6'>
                        Đăng ký giữ chỗ ngay hôm nay!
                    </h2>
                    <p className='text-blue-100 text-lg mb-8'>
                        Nhận ngay ưu đãi giảm 2.000.000đ khi đăng ký nhóm từ 3 người. Số lượng có hạn.
                    </p>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
                                <span className='material-symbols-outlined text-white'>call</span>
                            </div>
                            <div>
                                <p className='text-sm text-blue-200'>Hotline hỗ trợ 24/7</p>
                                <p className='text-xl font-bold'>1900 1000</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
                                <span className='material-symbols-outlined text-white'>location_on</span>
                            </div>
                            <div>
                                <p className='text-sm text-blue-200'>Địa chỉ văn phòng</p>
                                <p className='text-lg font-bold'>GJQ2+345 Cần Đước, Long An, Việt Nam</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <h3 className='text-[#111318] text-xl font-bold mb-2'>Thông tin đăng ký</h3>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Họ và tên
                            </label>
                            <input 
                                className='w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-4' 
                                placeholder='Nhập họ tên của bạn'
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Số điện thoại
                            </label>
                            <input
                                className='w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-4'
                                placeholder='Nhập số điện thoại của bạn'
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required/>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Khóa học quan tâm</label>
                            <select className='w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary h-12 px-4' name="course" value={formData.course} onChange={handleChange}>
                                <option value="">Chọn khóa học...</option>
                                <option value="b1">Hạng B1 (Số tự động)</option>
                                <option value="b2">Hạng B2 (Số sàn)</option>
                                <option value="c">Hạng C (Xe tải)</option>
                                <option value="chua-xac-dinh">Chưa xác định</option>
                            </select>
                        </div>
                        {!isAdmin ? (
                            <button disabled={loading} className={`cursor-pointer mt-4 w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-lg shadow-lg transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} type='submit'>
                                {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
                            </button>
                        ) : (
                            <div className='mt-4 w-full rounded-lg bg-gray-100 text-gray-500 font-bold h-12 flex items-center justify-center border border-gray-200'>
                                Admin View
                            </div>
                        )}
                        <p className='text-center text-xs text-gray-500 mt-2'>Chúng tôi sẽ liên hệ lại trong vòng 30 phút.</p>
                    </form>
                </div>
            </div>
        </div>
      </div>
    
  )
}

export default Registration
