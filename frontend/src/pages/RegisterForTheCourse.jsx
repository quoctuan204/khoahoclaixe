import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

// const provinceCodes = {
//   "001": "Hà Nội", "002": "Hà Giang", "004": "Cao Bằng", "006": "Bắc Kạn", "008": "Tuyên Quang",
//   "010": "Lào Cai", "011": "Điện Biên", "012": "Lai Châu", "014": "Sơn La", "015": "Yên Bái",
//   "017": "Hòa Bình", "019": "Thái Nguyên", "020": "Lạng Sơn", "022": "Quảng Ninh", "024": "Bắc Giang",
//   "025": "Phú Thọ", "026": "Vĩnh Phúc", "027": "Bắc Ninh", "030": "Hải Dương", "031": "Hải Phòng",
//   "033": "Hưng Yên", "034": "Thái Bình", "035": "Hà Nam", "036": "Nam Định", "037": "Ninh Bình",
//   "038": "Thanh Hóa", "040": "Nghệ An", "042": "Hà Tĩnh", "044": "Quảng Bình", "045": "Quảng Trị",
//   "046": "Thừa Thiên Huế", "048": "Đà Nẵng", "049": "Quảng Nam", "051": "Quảng Ngãi", "052": "Bình Định",
//   "054": "Phú Yên", "056": "Khánh Hòa", "058": "Ninh Thuận", "060": "Bình Thuận", "062": "Kon Tum",
//   "064": "Gia Lai", "066": "Đắk Lắk", "067": "Đắk Nông", "068": "Lâm Đồng", "070": "Bình Phước",
//   "072": "Tây Ninh", "074": "Bình Dương", "075": "Đồng Nai", "077": "Bà Rịa - Vũng Tàu", "079": "Hồ Chí Minh",
//   "080": "Long An", "082": "Tiền Giang", "083": "Bến Tre", "084": "Trà Vinh", "086": "Vĩnh Long",
//   "087": "Đồng Tháp", "089": "An Giang", "091": "Kiên Giang", "092": "Cần Thơ", "093": "Hậu Giang",
//   "094": "Sóc Trăng", "095": "Bạc Liêu", "096": "Cà Mau"
// }

const RegisterForTheCourse = () => {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')
  const [imageSrc, setImageSrc] = useState(assets.b1sotudong)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const [products, setProducts] = useState([])
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
  const [loading, setLoading] = useState(false)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  useEffect(() => {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then(response => response.json())
      .then(data => {
        if (data.error === 0) setProvinces(data.data)
      })
      .catch(error => console.error('Error fetching provinces:', error))
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then(response => response.json())
        .then(data => {
          if (data.error === 0) {
            setDistricts(data.data)
            setWards([])
            setSelectedDistrict('')
            setSelectedWard('')
          }
        })
        .catch(error => console.error('Error fetching districts:', error))
    } else {
      setDistricts([])
      setWards([])
      setSelectedDistrict('')
      setSelectedWard('')
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then(response => response.json())
        .then(data => {
          if (data.error === 0) {
            setWards(data.data)
            setSelectedWard('')
          }
        })
        .catch(error => console.error('Error fetching wards:', error))
    } else {
      setWards([])
      setSelectedWard('')
    }
  }, [selectedDistrict])

  useEffect(() => {
    const p = provinces.find(item => item.id === selectedProvince)?.full_name || ''
    const d = districts.find(item => item.id === selectedDistrict)?.full_name || ''
    const w = wards.find(item => item.id === selectedWard)?.full_name || ''
    
    if (p) {
      const fullAddress = [w, d, p].filter(Boolean).join(', ')
      setFormData(prev => ({ ...prev, address: fullAddress }))
    }
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards])

  // Fetch danh sách khóa học từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.filter(p => p.isVisible !== false)) // Chỉ lấy khóa học được hiển thị
        }
      } catch (error) {
        console.error('Failed to fetch products', error)
      }
    }
    fetchProducts()
  }, [API_BASE])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // if (name === 'cccd' && value.length >= 3) {
    //   const code = value.substring(0, 3)
    //   const province = provinceCodes[code]
    //   if (province) {
    //     setFormData(prev => {
    //       if (!prev.address || !prev.address.includes(province)) {
    //         return { ...prev, [name]: value, address: province }
    //       }
    //       return { ...prev, [name]: value }
    //     })
    //     return
    //   }
    // }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error('Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã.')
      return
    }

    setLoading(true)
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
          course: '',
          cccd: '',
          address: '',
          note: ''
        })
        setSelectedProvince('')
        setSelectedDistrict('')
        setSelectedWard('')
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Có lỗi từ máy chủ. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Helper lấy thông tin khóa học từ danh sách đã fetch
  const getProductInfo = (courseId) => {
    const product = products.find(p => p.id === courseId)
    if (!product) return null
    
    let img = product.image
    if (img && img.startsWith('/uploads/')) {
      img = `${API_BASE}${img}`
    }
    // Fallback ảnh mặc định nếu DB chưa có ảnh
    if (!img) {
        if (courseId === 'b1') img = assets.b1sotudong
        else if (courseId === 'b2') img = assets.toyotavios
        else if (courseId === 'c') img = assets.c1xetai
        else img = assets.b1sotudong
    }

    return {
      name: product.title,
      image: img
    }
  }

  useEffect(() => {
    if (products.length === 0) return

    const s = location.state || {}
    if (s.course) {
      // Tìm khóa học tương ứng trong danh sách products
      // Logic này hỗ trợ cả ID chính xác hoặc ID cũ (b1, b2...)
      let key = s.course
      let info = getProductInfo(key)
      
      if (info) {
        setSelectedCourse(key)
        setSelectedCourseName(info.name)
        setImageSrc(info.image)
        setFormData(prev => ({ ...prev, course: key }))
      }
    }
  }, [location.state, products])

  const handleCourseChange = (e) => {
    const v = e.target.value
    setSelectedCourse(v)
    const info = getProductInfo(v)
    if (info) {
      setSelectedCourseName(info.name)
      setImageSrc(info.image)
    }
    setFormData(prev => ({ ...prev, course: v }))
  }

  return (
    <div className='flex-grow w-full'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
            {/* Left Column */}
            <div className='lg:col-span-5 lg:sticky lg:top-24 space-y-8'>
                <div className='space-y-4'>
                    <h1 className='text-4xl md:text-5xl font-black tracking-tight text-[#135bec] leading-[1.1]'>
                        Hành trình lái xe an toàn bắt đầu tại đây.
                    </h1>
                    <p className='text-lg text-[#616f89] leading-relaxed'>
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
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318]'>
                                Cam kết không phát sinh chi phí phụ.
                            </span>
                        </li>

                        <li className='flex items-start gap-3'>
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318]'>
                                Lịch học linh hoạt
                            </span>
                        </li>

                        <li className='flex items-start gap-3'>
                            <div className='flex-shrink-0 size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5'>
                                <span className='material-symbols-outlined text-[16px]'>check</span>
                            </div>
                            <span className='text-[#111318]'>
                                Hỗ trợ làm hồ sơ thi sát hạch trọn gói.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Column */}
            <div className='lg:col-span-7'>
                <div className='bg-[#ffffff] rounded-2xl shadow-xl border border-[#dbdfe6] p-6 sm:p-8 lg:p-10'>
                    <div className='mb-8 border-b border-[#dbdfe6] pb-6'>
                        <h2 className='text-2xl font-bold text-[#135bec] mb-2'>
                            Thông tin đăng ký
                        </h2>
                        <p className='text-[#616f89] text-sm'>
                            Vui lòng điền đầy đủ thông tin bên dưới để giữ chỗ.
                        </p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Name Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                                <label 
                                    className='block text-sm font-medium text-[#111318]'
                                    for='lastname'>
                                        Họ <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
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
                                    className='block text-sm font-medium text-[#111318]'
                                    for='lastname'>
                                        Tên <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
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
                            <label className='block text-sm font-medium text-[#111318]' for='email'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]'>
                                        <span className='material-symbols-outlined text-[20px]'>mail</span>
                                    </div>
                                    <input
                                    className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 pl-10 pr-4 placeholder:text-[#616f89]/60'
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
                            <label className='block text-sm font-medium text-[#111318]' for='email'>
                                    Số điện thoại <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]'>
                                        <span className='material-symbols-outlined text-[20px]'>call</span>
                                    </div>
                                    <input
                                    className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 pl-10 pr-4 placeholder:text-[#616f89]/60'
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

                        {/* Course Selection - Card Style for Mobile */}
                        <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#111318] mb-2">
                            Chọn khóa học
                          </label>
                          <div className="flex flex-col gap-4 md:hidden">
                            {products.map((p) => {
                              const isSelected = selectedCourse === p.id
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  onClick={() => {
                                    setSelectedCourse(p.id)
                                    setSelectedCourseName(p.title)
                                    setImageSrc(p.image || assets.b1sotudong)
                                    setFormData(prev => ({ ...prev, course: p.id }))
                                  }}
                              className={`flex items-center gap-4 rounded-xl border-2 px-3 py-3 transition-all shadow-sm ${isSelected ? 'border-[#135bec] bg-blue-50' : 'border-gray-200 bg-white'} ${p.isVisible === false ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                                  disabled={p.isVisible === false}
                                >
                                  <img src={p.image || assets.b1sotudong} alt={p.title} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-base text-[#111318]">{p.title}</span>
                                      {p.id === 'b1-sotudong' && (
                                        <span className="bg-[#f97316] text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Phổ biến</span>
                                      )}
                                    </div>
                                <div className="text-xs text-gray-500 line-clamp-2">{p.description}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[#135bec] font-bold">{p.price}</span>
                                      {p.oldPrice && <span className="text-xs text-gray-400 line-through">{p.oldPrice}</span>}
                                    </div>
                                    {p.highlights && p.highlights.length > 0 && (
                                      <ul className="flex flex-wrap gap-1 mt-1">
                                        {p.highlights.slice(0,2).map((h, i) => (
                                          <li key={i} className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded px-2 py-0.5">
                                            <span className="material-symbols-outlined text-[16px]">check</span>{h}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  {isSelected && <span className="material-symbols-outlined text-[#135bec] text-2xl ml-2">check_circle</span>}
                                </button>
                              )
                            })}
                          </div>
                          {/* Desktop vẫn dùng select truyền thống */}
                          <div className="relative hidden md:block">
                            <select
                          className="w-full appearance-none rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-14 px-4 pr-10"
                              id="course"
                              value={selectedCourse}
                              onChange={handleCourseChange}
                              required
                            >
                              <option disabled value="">Vui lòng chọn khóa học...</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#616f89]">
                              <span className="material-symbols-outlined text-[24px]">expand_more</span>
                            </div>
                          </div>
                        </div>

                        {/* Address & ID */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='space-y-2'>
                            <label className='block text-sm font-medium text-[#111318]' for='cccd'>
                                    Số CCCD/CMND
                                </label>
                                <input
                                className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 placeholder:text-[#616f89]/60'
                                    id='cccd'
                                    placeholder='cccd/cmnd'
                                    type="text"
                                    name='cccd'
                                    value={formData.cccd}
                                    onChange={handleInputChange}/>
                            </div>

                            <div className='space-y-2'>
                            <label className='block text-sm font-medium text-[#111318]' for='cccd'>
                                    Địa chỉ thường trú
                                </label>
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                    <div className='relative'>
                                        <select
                                        className='w-full appearance-none rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 pr-8'
                                            value={selectedProvince}
                                            onChange={(e) => setSelectedProvince(e.target.value)}
                                        >
                                            <option value="">Tỉnh/Thành phố</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.full_name}</option>
                                            ))}
                                        </select>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#616f89]'><span className='material-symbols-outlined text-[20px]'>expand_more</span></div>
                                    </div>
                                    <div className='relative'>
                                        <select
                                        className='w-full appearance-none rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 pr-8'
                                            value={selectedDistrict}
                                            onChange={(e) => setSelectedDistrict(e.target.value)}
                                            disabled={!selectedProvince}
                                        >
                                            <option value="">Quận/Huyện</option>
                                            {districts.map(d => (
                                                <option key={d.id} value={d.id}>{d.full_name}</option>
                                            ))}
                                        </select>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#616f89]'><span className='material-symbols-outlined text-[20px]'>expand_more</span></div>
                                    </div>
                                    <div className='relative'>
                                        <select
                                        className='w-full appearance-none rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] h-12 px-4 pr-8'
                                            value={selectedWard}
                                            onChange={(e) => setSelectedWard(e.target.value)}
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">Phường/Xã</option>
                                            {wards.map(w => (
                                                <option key={w.id} value={w.id}>{w.full_name}</option>
                                            ))}
                                        </select>
                                        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#616f89]'><span className='material-symbols-outlined text-[20px]'>expand_more</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Note (Optional) */}
                        <div className='space-y-2'>
                        <label className='block text-sm font-medium text-[#111318]' for='note'>
                                Ghi chú thêm
                            </label>
                            <textarea 
                            className='w-full rounded-lg border-[#dbdfe6] bg-white text-[#111318] shadow-sm focus:border-[#135bec] focus:ring-[#135bec] px-4 py-3 placeholder:text-[#616f89]/60 resize-none'
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
                                    <button disabled={loading} className={`group relative flex w-full justify-center rounded-lg border border-transparent bg-[#135bec] py-4 px-4 text-base font-bold text-white hover:bg-[#0f4bc4] focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:ring-offset-2 transition-all shadow-lg shadow-[#135bec]/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} type="submit">
                                        <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                            {!loading && <span className='material-symbols-outlined group-hover:animate-pulse'>
                                                how_to_reg
                                            </span>}
                                        </span>
                                        {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                                    </button>
                                <p className='mt-4 text-center text-xs text-[#616f89]'>
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
