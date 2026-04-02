import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Contactinformation = () => {
  const { isAdmin } = useAuth()
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    course: '',
    note: ''
  })
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    address: 'GJQ2+345 Cần Đước, Long An, Việt Nam',
    hotline: '1900 1234',
    email: 'truongdaotaosathach@gmail.com'
  })

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(err => console.error(err))
  }, [])

  const handleInputChange = (e) => {
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
        toast.success('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ lại trong vòng 15 phút.')
        setFormData({
          fullname: '',
          phone: '',
          course: '',
          note: ''
        })
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // const address = settings.address || "SÂN TẬP LÁI XE CẦN ĐƯỚC, GJP2+X7X, Mỹ Lệ, Cần Đước, Long An, Việt Nam";
  // const encodedAddress = encodeURIComponent(address);

  return (
    <div className='flex-1 w-full bg-background-light dark:bg-background-dark py-10 lg:py-16'>
      <div className='max-w-7xl mx-auto px-4 lg:px-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
          <div className='lg:col-span-5 flex flex-col gap-8'>
            <div>
              <h2 className='text-[#111318] dark:text-white text-2xl font-bold mb-6 flex items-center gap-2'>
                <span className='w-1 h-8 bg-[#f97316] rounded-full block'></span>
                Thông tin liên hệ
              </h2>
              <div className='flex flex-col gap-4'>
                {/* Address Card */}
                <div className='flex gap-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] p-5 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='bg-[#135bec]/10 text-[#135bec] p-3 rounded-full h-fit'>
                    <span className='material-symbols-outlined'>location_on</span>
                  </div>
                  <div>
                    <h3 className='text-[#111318] dark:text-white text-base font-bold mb-1'>Địa chỉ trung tâm</h3>
                    <p className='text-[#616f89] dark:text-gray-400 text-sm'>{settings.address}</p>
                  </div>
                </div>

                {/* Hotline Card */}
                <div className='flex gap-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] p-5 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='bg-[#135bec]/10 text-[#135bec] p-3 rounded-full h-fit'>
                    <span className='material-symbols-outlined'>call</span>
                  </div>
                  <div>
                    <h3 className='text-[#111318] dark:text-white text-base font-bold mb-1'>Hotline tư vấn</h3>
                    <p className='text-[#f97316] text-lg font-bold'>{settings.hotline}</p>
                    <p className='text-[#616f89] dark:text-gray-400 text-xs mt-1'>Hỗ trợ 24/7 (Cả T7 &amp; CN)</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className='flex gap-4 rounded-xl border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-[#1a202c] p-5 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='bg-[#135bec]/10 text-[#135bec] p-3 rounded-full h-fit'>
                    <span className='material-symbols-outlined'>mail</span>
                  </div>
                  <div>
                    <h3 className='text-[#111318] dark:text-white text-base font-bold mb-1'>Email hỗ trợ</h3>
                    <p className='text-[#616f89] dark:text-gray-400 text-sm'>{settings.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* map */}
            <div className='rounded-xl overflow-hidden border border-[#dbdfe6] dark:border-gray-700 shadow-sm h-64 lg:h-auto lg:flex-1 min-h-[250px] relative group'>
              <iframe
                className='w-full h-full object-cover transition-all duration-500'
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1007.1649007809158!2d106.6004964805621!3d10.537466154418244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31753537aa132061%3A0x476a4f3efb01c894!2zU8OCTiBU4bqsUCBMw4FJIFhFIEPhuqZOIMSQxq_hu5pD!5e1!3m2!1svi!2s!4v1770107565312!5m2!1svi!2s"
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
              <a
                href="https://www.google.com/maps/place/S%C3%82N+T%E1%BA%ACP+L%C3%81I+XE+C%E1%BA%A6N+%C4%90%C6%AF%E1%BB%9AC/@10.5374662,106.6004965,18z/data=!4m6!3m5!1s0x31753537aa132061:0x476a4f3efb01c894!8m2!3d10.5374662!4d106.6004965!16s%2Fg%2F11h0_0_0_0"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center"
              >
                <span className="bg-white text-[#135bec] px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">near_me</span>
                  Xem bản đồ
                </span>
              </a>
            </div>
          </div>

          {/* Mẫu đăng ký */}
          <div className='lg:col-span-7'>
            <div className='bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl border border-[#dbdfe6] dark:border-gray-700 p-6 lg:p-10 sticky top-24'>
              <div className='mb-8'>
                <h2 className='text-[#111318] dark:text-white text-2xl lg:text-3xl font-black mb-2 text-center lg:text-left'>
                  Đăng ký tư vấn miễn phí
                </h2>
                <p className='text-[#616f89] dark:text-gray-400 text-sm text-center lg:text-left'>
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong vòng 15 phút.
                </p>
              </div>
              <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[#111318] dark:text-gray-200 text-sm font-bold' for="fullname">Họ và tên *</label>
                    <input
                      className='h-12 w-full rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-800 px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] outline-none transition-all'
                      id='fullname'
                      placeholder='Nhập họ và tên'
                      type="text"
                      name='fullname'
                      value={formData.fullname}
                      onChange={handleInputChange}
                      required/>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label className='text-[#111318] dark:text-gray-200 text-sm font-bold' for="phone">Số điện thoại *</label>
                    <input
                      className='h-12 w-full rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-800 px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] outline-none transition-all'
                      id='phone'
                      placeholder='Nhập số điện thoại'
                      type="tel"
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      required/>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-[#111318] dark:text-gray-200 text-sm font-bold' for="course">
                    Khóa học quan tâm
                  </label>
                  <div className='relative'>
                    <select className='h-12 w-full appearance-none rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-800 px-4 text-[#111318] dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] outline-none transition-all cursor-pointer'
                      id='course'
                      name='course'
                      value={formData.course}
                      onChange={handleInputChange}>
                        <option disabled="" selected="" value="">Chọn khóa học phù hợp</option>
                        <option value="b1">Hạng B1 (Số tự động)</option>
                        <option value="b2">Hạng B2 (Số sàn &amp; tự động)</option>
                        <option value="c">Hạng C (Xe tải)</option>
                        <option value="nang-hang">Nâng hạng bằng lái</option>
                        <option value="bo-tuc">Bổ túc tay lái</option>
                    </select>

                    <div className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#616f89]'>
                      <span className='material-symbols-outlined'>expand_more</span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-[#111318] dark:text-gray-200 text-sm font-bold' for="message">
                    Nội dung cần tư vấn
                  </label>
                  <textarea
                    className='w-full rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-[#f9fafb] dark:bg-gray-800 p-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] outline-none transition-all resize-none'
                    rows="4"
                    placeholder='Ví dụ: Tôi muốn học vào cuối tuần...'
                    id="message"
                    name='note'
                    value={formData.note}
                    onChange={handleInputChange}></textarea>
                </div>
                <div className='flex items-start gap-3 mt-2'>
                  <input
                    className='mt-1 h-4 w-4 rounded border-gray-300 text-[#135bec] focus:ring-[#135bec]'
                    id='policy'
                    type="checkbox"/>
                  <label
                    className='text-sm text-[#616f89] dark:text-gray-400'
                    for="policy">
                      Tôi đồng ý với <a className='text-[#135bec] hover:underline' href="#">điều khoản dịch vụ</a> và <a className='text-[#135bec] hover:underline' href="#">chính sách bảo mật</a>.
                  </label>
                </div>
                {!isAdmin ? (
                  <button 
                    disabled={loading}
                    className={`mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#135bec] hover:bg-[#135bec]-hover text-white text-base font-bold shadow-lg shadow-[#135bec]/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    type='submit'>
                      {loading ? 'Đang xử lý...' : 'Gửi đăng ký ngay'}
                  </button>
                ) : (
                  <div className='mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-500 font-medium border border-gray-200'>
                    Admin không cần đăng ký
                  </div>
                )}
                <p className='text-center text-xs text-[#9ca3af] mt-2 flex items-center justify-center gap-1'>
                  <span className='material-symbols-outlined text-sm'>lock</span> Cam kết bảo mật thông tin 100%
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contactinformation
