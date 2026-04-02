import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products'
import AdminOnly from '../components/AdminOnly'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

    useEffect(() => {
      let cancelled = false
      const load = async () => {
        // Lấy dữ liệu tĩnh làm gốc
        const pLocal = products.find(x => x.id === productId)

        try {
          const r = await fetch(`${API_BASE}/api/products/${productId}`)
          if (r.ok) {
            const pDb = await r.json()
            
            // Gộp dữ liệu: DB đè lên Local (để giữ lại các trường DB không có như highlights, images nếu chưa update)
            const merged = pLocal ? { ...pLocal, ...pDb } : pDb

            // if image is a server path, prefix with API base
            if (merged.image && typeof merged.image === 'string' && merged.image.startsWith('/uploads/')) {
              merged.image = `${API_BASE}${merged.image}`
            }
            if (!cancelled) setProduct(merged)
            return
          }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          // ignore and fall back
        }

        // fallback to local static list
        if (!cancelled) setProduct(pLocal || null)
      }

      load()
      return () => { cancelled = true }
    }, [API_BASE, productId])

    const [editing, setEditing] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newPrice, setNewPrice] = useState('')
    const [newOldPrice, setNewOldPrice] = useState('')
    const [uploading, setUploading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
      setNewTitle(product?.title || '')
      setNewDesc(product?.description || '')
      setNewPrice(product?.price || '')
      setNewOldPrice(product?.oldPrice || '')
    }, [product])

    useEffect(() => {
      return () => {
        if (preview) URL.revokeObjectURL(preview)
      }
    }, [preview])

    // Tối ưu SEO: Cập nhật Title và Meta Description động
    useEffect(() => {
      if (product) {
        document.title = `${product.title} | Trung tâm đào tạo lái xe`
        let metaDesc = document.querySelector('meta[name="description"]')
        if (!metaDesc) {
          metaDesc = document.createElement('meta')
          metaDesc.name = 'description'
          document.head.appendChild(metaDesc)
        }
        metaDesc.content = product.description || `Khóa học ${product.title} chất lượng cao, cam kết đầu ra.`
      }
    }, [product])

    // Scroll Spy: Theo dõi vị trí cuộn để active tab
    useEffect(() => {
        const handleScroll = () => {
            const headerOffset = 180 // Khoảng cách offset để kích hoạt tab sớm hơn
            const scrollPosition = window.scrollY + headerOffset

            const loTrinh = document.getElementById('lo-trinh')
            const hocPhi = document.getElementById('hoc-phi')
            const hoSo = document.getElementById('ho-so')
            
            if (hoSo && scrollPosition >= hoSo.offsetTop) {
                setActiveTab('ho-so')
            } else if (hocPhi && scrollPosition >= hocPhi.offsetTop) {
                setActiveTab('hoc-phi')
            } else if (loTrinh && scrollPosition >= loTrinh.offsetTop) {
                setActiveTab('lo-trinh')
            } else {
                setActiveTab('overview')
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const { token } = useAuth()

    const saveEdits = async () => {
      setUploading(true)

      try {
        if (!token) throw new Error('Not authenticated')

        let finalImage = product.image
        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile)
          const uploadRes = await fetch(`${API_BASE}/api/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.message || 'Lỗi tải ảnh lên server');
          }
          const uploadJson = await uploadRes.json()
          if (uploadJson.imageUrl) {
            finalImage = uploadJson.imageUrl.startsWith('http') ? uploadJson.imageUrl : `${API_BASE}${uploadJson.imageUrl}`
          }
        }

        // optimistic update
        setProduct(prev => ({ ...prev, title: newTitle, description: newDesc, price: newPrice, oldPrice: newOldPrice, image: finalImage }))
        
        const r = await fetch(`${API_BASE}/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            title: newTitle, 
            description: newDesc,
            price: newPrice,
            oldPrice: newOldPrice,
            image: finalImage.replace(API_BASE, '') // Lưu đường dẫn tương đối
          })
        })
        if (!r.ok) {
          const j = await r.json().catch(() => ({}))
          throw new Error(j.message || 'Update failed')
        }
        // response contains updated product if needed
        const updated = await r.json()
        setProduct(updated)
        setEditing(false)
      } catch (err) {
        console.error('Save edits failed', err)
        // optionally show notification
      } finally {
        setUploading(false)
      }
    }

    const validateFile = (file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Định dạng file không hợp lệ. Vui lòng chọn ảnh (JPEG, PNG, GIF, WEBP).')
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.')
        return false
      }
      return true
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file && validateFile(file)) {
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
      }
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && validateFile(file)) {
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
      }
    }

    if (!product) {
      return (
        <div className='flex justify-center w-full py-8 px-4 lg:px-8'>
          <div className='w-full max-w-[800px] text-center'>
            <h2 className='text-2xl font-bold mb-4'>Sản phẩm không tồn tại</h2>
            <button onClick={() => navigate(-1)} className='rounded-lg bg-blue-500 text-white px-4 py-2'>Quay lại</button>
          </div>
        </div>
      )
    }

    // Helper functions for price calculation
    const parsePrice = (str) => parseInt(str?.replace(/\D/g, '') || '0', 10)
    const formatPrice = (num) => new Intl.NumberFormat('vi-VN').format(num) + 'đ'

    const totalPrice = parsePrice(product.price)
    const theoryFee = product.theoryFee ? parsePrice(product.theoryFee) : 5000000
    const examFee = product.examFee ? parsePrice(product.examFee) : 1500000
    // Calculate practice fee based on total price to ensure they sum up correctly
    const practiceFee = Math.max(0, totalPrice - theoryFee - examFee)

    const getDatDistance = (id) => {
        if (!id) return '810km'
        if (id.includes('b1')) return '710km'
        if (id.includes('c')) return '825km'
        return '810km'
    }

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            const headerOffset = 120
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
    }

    return (

        // nội dung chính
        <div className='flex justify-center w-full py-8 px-4 lg:px-8'>
            <div className='w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-8'>
                {/* Left Column: Content (8 cols) */}
                <div className='lg:col-span-8 flex flex-col gap-8'>
                    {/* Hero Image & Title Section */}
                    <div className='rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100'>
                        <div className='relative h-[300px] md:h-[400px] w-full bg-gray-200'>
                            <img src={product.image} className='absolute inset-0 w-full h-full object-cover' alt={product.title} />
                            <div className='absolute bottom-0 left-0 p-6 md:p-8 text-white w-full'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <span className='bg-[#ff7a00] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider'>
                                        {product.id === 'b1-sotudong' ? 'Phổ biến nhất' : 'Khóa học'}
                                    </span>
                                    <span className='bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1'>
                                        <span className='material-symbols-outlined text-[14px]'>star</span> 4.9 (1,203 đánh giá)
                                    </span>
                                </div>

                                <h1 className='text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2'>
                                    {product.title}
                                </h1>
                                <p className='text-gray-200 text-sm md:text-base max-w-2xl'>
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100'>
                        <div className='p-4 flex flex-col items-center justify-center text-center'>
                            <span className='material-symbols-outlined text-[#135bec] mb-1'>schedule</span>
                            <span className='text-xs text-gray-500 font-medium'>Thời gian</span>
                            <span className='text-sm font-bold'>{product.duration}</span>
                        </div>
                        <div className='p-4 flex flex-col items-center justify-center text-center'>
                            <span className='material-symbols-outlined text-[#135bec] mb-1'>directions_car</span>
                            <span className='text-xs text-gray-500 font-medium'>Xe thực hành</span>
                            <span className='text-sm font-bold'>{product.vehicle}</span>
                        </div>
                        <div className='p-4 flex flex-col items-center justify-center text-center'>
                            <span className='material-symbols-outlined text-[#135bec] mb-1'>school</span>
                            <span className='text-xs text-gray-500 font-medium'>Hình thức</span>
                            <span className='text-sm font-bold'>Kèm 1-1</span>
                        </div>
                        <div className='p-4 flex flex-col items-center justify-center text-center'>
                            <span className='material-symbols-outlined text-[#135bec] mb-1'>verified</span>
                            <span className='text-xs text-gray-500 font-medium'>Cam kết</span>
                            <span className='text-sm font-bold'>Hợp đồng pháp lý</span>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className='flex overflow-x-auto border-b border-gray-200 gap-6 pb-1'>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                            className={`${activeTab === 'overview' ? 'text-[#135bec] border-b-2 border-[#135bec] font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'} px-2 pb-3 whitespace-nowrap transition-colors`}
                        >
                            Tổng quan
                        </button>
                        <button 
                            onClick={() => scrollToSection('lo-trinh')} 
                            className={`${activeTab === 'lo-trinh' ? 'text-[#135bec] border-b-2 border-[#135bec] font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'} px-2 pb-3 whitespace-nowrap transition-colors`}
                        >
                            Lộ trình đào tạo
                        </button>
                        <button 
                            onClick={() => scrollToSection('hoc-phi')} 
                            className={`${activeTab === 'hoc-phi' ? 'text-[#135bec] border-b-2 border-[#135bec] font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'} px-2 pb-3 whitespace-nowrap transition-colors`}
                        >
                            Học phí chi tiết
                        </button>
                        <button 
                            onClick={() => scrollToSection('ho-so')} 
                            className={`${activeTab === 'ho-so' ? 'text-[#135bec] border-b-2 border-[#135bec] font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'} px-2 pb-3 whitespace-nowrap transition-colors`}
                        >
                            Hồ sơ đăng ký
                        </button>
                    </div>

                    {/* Quyền lợi */}
                    {product.highlights && product.highlights.length > 0 && (
                      <div>
                        <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                            <span className='w-1 h-6 bg-[#135bec] rounded-full'></span>
                            Quyền lợi học viên {product.title}
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {product.highlights.map((item, index) => (
                                <div key={index} className='bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex gap-4 items-start'>
                                    <div className='bg-blue-50 p-2 rounded-lg text-[#135bec] shrink-0'>
                                        <span className='material-symbols-outlined'>check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-base mb-1'>{item}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Lộ trình đào tạo */}
                    <div id='lo-trinh' className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                            <span className='w-1 h-6 bg-[#135bec] rounded-full'></span>
                            Lộ trình đào tạo chuẩn 2026
                        </h3>
                        <div className='grid grid-cols-[40px_1fr] gap-x-2 px-0 md:px-4'>
                            {/* Step 1 */}
                            <div className='flex flex-col items-center gap-1 pt-1'>
                                <div className='text-white bg-[#135bec] rounded-full p-1.5 flex items-center justify-center shadow-md z-10'>
                                    <span className='material-symbols-outlined text-[20px]'>menu_book</span>
                                </div>
                                <div className='w-[2px] bg-gray-200 h-full grow'></div>
                            </div>
                            <div className='flex flex-col pb-8 pl-4'>
                                <h4 className='text-[#111318] text-lg font-bold leading-normal'>
                                    Giai đoạn 1: Lý thuyết &amp; Mô phỏng
                                </h4>
                                <span className='text-[#135bec] text-sm font-semibold mb-2'>Tuần 1 - 2</span>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Học viên được trang bị kiến thức về Luật GTĐB, biển báo, sa hình. Thực hành trên cabin mô phỏng 3D các tình huống giao thông.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className='flex flex-col items-center gap-1 pt-1'>
                                <div className='text-white bg-[#135bec] rounded-full p-1.5 flex items-center justify-center shadow-md z-10'>
                                    <span className='material-symbols-outlined text-[20px]'>directions_car</span>
                                </div>
                                <div className='w-[2px] bg-gray-200 h-full grow'></div>
                            </div>
                            <div className='flex flex-col py-8 pl-4'>
                                <h4 className='text-[#111318] text-lg font-bold leading-normal'>
                                    Giai đoạn 2: Thực hành DAT (Đường trường)
                                </h4>
                                <span className='text-[#135bec] text-sm font-semibold mb-2'>{getDatDistance(product.id)} đường trường</span>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Chạy đủ {getDatDistance(product.id)} đường trường có thiết bị giám sát hành trình (DAT). Lái xe thực tế trên đường phố đông đúc, đường trường, ban đêm.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className='flex flex-col items-center gap-1 pt-1'>
                                <div className='text-white bg-[#135bec] rounded-full p-1.5 flex items-center justify-center shadow-md z-10'>
                                    <span className='material-symbols-outlined text-[20px]'>flag</span>
                                </div>
                                <div className='w-[2px] bg-gray-200 h-full grow'></div>
                            </div>
                            <div className='flex flex-col py-8 pl-4'>
                                <h4 className='text-[#111318] text-lg font-bold leading-normal'>
                                    Giai đoạn 3: Thực hành Sa hình
                                </h4>
                                <span className='text-[#135bec] text-sm font-semibold mb-2'>11 bài thi liên hoàn</span>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Luyện tập 11 bài sa hình trong sân thi tiêu chuẩn. Tập trung các bài khó: Dốc cầu, Ghép ngang, Ghép dọc.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className='flex flex-col items-center gap-1 pt-1'>
                                <div className='text-white bg-[#135bec] rounded-full p-1.5 flex items-center justify-center shadow-md z-10'>
                                    <span className='material-symbols-outlined text-[20px]'>workspace_premium</span>
                                </div>
                            </div>
                            <div className='flex flex-col pt-8 pl-4'>
                                <h4 className='text-[#111318] text-lg font-bold leading-normal'>
                                    Giai đoạn 4: Thi tốt nghiệp &amp; Sát hạch
                                </h4>
                                <span className='text-[#135bec] text-sm font-semibold mb-2'>Cấp chứng chỉ &amp; Bằng lái</span>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Thi tốt nghiệp tại trung tâm và thi sát hạch do Sở GTVT tổ chức. Nhận bằng sau 15-20 ngày.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết học phí */}
                    <div id='hoc-phi'>
                        <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                            <span className='w-1 h-6 bg-[#135bec] rounded-full'></span>
                            Chi tiết học phí
                        </h3>

                        <div className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
                            <table className='w-full text-left text-sm text-gray-600'>
                                <thead className='bg-gray-50 text-xs uppercase text-gray-700 font-bold'>
                                    <tr>
                                        <th className='px-6 py-4' scope='col'>Khoản mục</th>
                                        <th className='px-6 py-4 text-right' scope='col'>Chi phí</th>
                                        <th className='px-6 py-4' scope='col'>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 bg-white'>
                                    <tr>
                                        <th className='px-6 py-4 font-medium text-gray-900'>Phí hồ sơ &amp; Đào tạo lý thuyết</th>
                                        <th className='px-6 py-4 text-right font-bold'>{formatPrice(theoryFee)}</th>
                                        <th className='px-6 py-4'>Đã bao gồm tài liệu, phần mềm</th>
                                    </tr>
                                    <tr>
                                        <th className='px-6 py-4 font-medium text-gray-900'>Phí đào tạo thực hành (Xăng xe, bãi tập, thầy)</th>
                                        <th className='px-6 py-4 text-right font-bold'>{formatPrice(practiceFee)}</th>
                                        <th className='px-6 py-4'>Chạy DAT + Sa hình</th>
                                    </tr>
                                    <tr>
                                        <th className='px-6 py-4 font-medium text-gray-900'>Lệ phí thi tốt nghiệp &amp; Sát hạch</th>
                                        <th className='px-6 py-4 text-right font-bold'>{formatPrice(examFee)}</th>
                                        <th className='px-6 py-4'>Theo quy định sở GTVT</th>
                                    </tr>
                                    <tr>
                                        <th className='px-6 py-4 font-medium text-gray-900'>Khám sức khỏe</th>
                                        <th className='px-6 py-4 text-right font-bold'>Miễn phí</th>
                                        <th className='px-6 py-4 text-green-600 font-medium'>Ưu đãi tháng này</th>
                                    </tr>
                                    <tr className='bg-blue-50/50'>
                                        <th className='px-6 py-4 font-bold text-[#135bec] text-base'>TỔNG CỘNG TRỌN GÓI</th>
                                        <th className='px-6 py-4 text-right font-black text-xl text-[#135bec]'>{product.price}</th>
                                        <th className='px-6 py-4 font-medium text-[#135bec]'>Cam kết không phát sinh</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Hồ sơ đăng ký */}
                    <div id='ho-so'>
                        <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                            <span className='w-1 h-6 bg-[#135bec] rounded-full'></span>
                            Hồ sơ đăng ký cần chuẩn bị
                        </h3>
                        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='flex gap-4'>
                                    <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#135bec] shrink-0'>
                                        <span className='material-symbols-outlined'>badge</span>
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-gray-900 text-lg'>01 Bản photo CCCD/CMND</h4>
                                        <p className='text-gray-500 text-sm mt-1'>Không cần công chứng. Mang theo bản gốc để đối chiếu khi đến đăng ký.</p>
                                    </div>
                                </div>

                                <div className='flex gap-4'>
                                    <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#135bec] shrink-0'>
                                        <span className='material-symbols-outlined'>portrait</span>
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-gray-900 text-lg'>2 Ảnh thẻ 3x4</h4>
                                        <p className='text-gray-500 text-sm mt-1'>Phông nền xanh dương đậm. Tóc tai gọn gàng, không đeo kính.</p>
                                    </div>
                                </div>

                                <div className='flex gap-4'>
                                    <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#135bec] shrink-0'>
                                        <span className='material-symbols-outlined'>medical_services</span>
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-gray-900 text-lg'>Giấy khám sức khỏe</h4>
                                        <p className='text-gray-500 text-sm mt-1'>Dành cho người lái xe (Mẫu A3). Khám tại bệnh viện cấp huyện trở lên.</p>
                                    </div>
                                </div>

                                <div className='flex gap-4'>
                                    <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#135bec] shrink-0'>
                                        <span className='material-symbols-outlined'>description</span>
                                    </div>
                                    <div>
                                        <Link to="/tai-bieu-mau" className='font-bold text-gray-900 text-lg hover:text-[#135bec] transition-colors inline-block'>
                                            Đơn đề nghị học, sát hạch
                                        </Link>
                                        <p className='text-gray-500 text-sm mt-1'>Được cấp miễn phí tại trung tâm. Hoặc <Link to="/tai-bieu-mau" className="text-[#135bec] font-bold hover:underline cursor-pointer">👉 Nhấn vào đây để tải biểu mẫu</Link></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className='mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-3'>
                                <span className='material-symbols-outlined text-yellow-600'>info</span>
                                <p className='text-sm text-yellow-800'>
                                    <strong>Lưu ý:</strong> Trung tâm có hỗ trợ chụp ảnh thẻ và photo CCCD miễn phí tại văn phòng ghi danh. Học viên chỉ cần mang theo CCCD gắn chip.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar (4 cols) */}
                <div className='lg:col-span-4 relative'>
                    <div className='top-6 flex flex-col gap-6'>

                        {/* Admin area (visible only to admin) */}
                        <AdminOnly>
                            <div className='bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h4 className='font-bold mb-1'>Chế độ Giảng viên</h4>
                                        <p className='text-sm text-gray-700'>Bạn có thể chỉnh sửa tiêu đề / mô tả ngay trên trang này.</p>
                                    </div>
                                    <div>
                                        <button onClick={() => setEditing(prev => !prev)} className='bg-[#135bec] text-white px-3 py-1 rounded mr-2'>
                                            {editing ? 'Huỷ' : 'Chỉnh sửa'}
                                        </button>
                                    </div>
                                </div>
                                {editing && (
                                    <div className='mt-4'>
                                        <label className='text-sm font-medium'>Tiêu đề</label>
                                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className='w-full mt-1 p-2 border rounded' />
                                        <label className='text-sm font-medium mt-2 block'>Mô tả</label>
                                        <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className='w-full mt-1 p-2 border rounded' rows={3} />
                                        
                                        <div className='grid grid-cols-2 gap-2 mt-2'>
                                          <div>
                                            <label className='text-sm font-medium block'>Giá hiện tại</label>
                                            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className='w-full mt-1 p-2 border rounded' />
                                          </div>
                                          <div>
                                            <label className='text-sm font-medium block'>Giá cũ (gạch ngang)</label>
                                            <input value={newOldPrice} onChange={e => setNewOldPrice(e.target.value)} className='w-full mt-1 p-2 border rounded' />
                                          </div>
                                        </div>

                                        <label className='text-sm font-medium mt-2 block'>Ảnh khóa học</label>
                                        <div 
                                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mt-1 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                                          onDragOver={handleDragOver}
                                          onDragLeave={() => setIsDragging(false)}
                                          onDrop={handleDrop}
                                          onClick={() => document.getElementById('product-file-upload').click()}
                                        >
                                          <input id="product-file-upload" type="file" onChange={handleImageChange} className='hidden' accept="image/*" />
                                          <span className="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
                                          <p className="text-xs text-gray-500 font-medium">Kéo thả hoặc click để chọn ảnh</p>
                                        </div>
                                        {uploading && <p className='text-xs text-blue-600 mt-1'>Đang xử lý...</p>}
                                        {preview && <img src={preview} alt="Preview" className='mt-2 h-20 object-cover rounded border' />}

                                        <div className='mt-3 flex gap-2'>
                                            <button onClick={saveEdits} disabled={uploading} className='bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-400'>Lưu</button>
                                            <button onClick={() => setEditing(false)} className='bg-gray-200 px-3 py-1 rounded'>Huỷ</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AdminOnly>

                        {/* Giá */}
                        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                            <div className='bg-[#135bec] p-4 text-center'>
                                <h3 className='text-white font-bold text-lg'>ĐĂNG KÝ KHÓA B2</h3>
                                <p className='text-blue-100 text-sm'>
                                    Khai giảng khóa mới: 15/10/2024
                                </p>
                            </div>
                            <div className='p-6 flex flex-col gap-4'>
                                <div className='text-center pb-4 border-b border-dashed border-gray-200'>
                                    <p className='text-gray-500 text-sm line-through decoration-red-500 decoration-2'>
                                        {product.oldPrice}
                                    </p>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className='text-3xl font-black text-[#111318]'>{product.price}</span>
                                        <span className='bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded'>
                                            -3tr
                                        </span>
                                    </div>
                                    <p className='text-xs text-[#ff7a00] font-bold mt-1 animate-pulse'>
                                        Chỉ còn 5 suất ưu đãi cuối cùng
                                    </p>
                                </div>
                                <ul className='space-y-3'>
                                    <li className='flex items-start gap-3 text-sm text-gray-700'>
                                        <span className='material-symbols-outlined text-green-500 text-lg'>check_circle</span>
                                        <span>Đã bao gồm phí DAT 810km</span>
                                    </li>

                                    <li className='flex items-start gap-3 text-sm text-gray-700'>
                                        <span className='material-symbols-outlined text-green-500 text-lg'>check_circle</span>
                                        <span>Hỗ trợ trả góp 0% lãi suất</span>
                                    </li>

                                    <li className='flex items-start gap-3 text-sm text-gray-700'>
                                        <span className='material-symbols-outlined text-green-500 text-lg'>check_circle</span>
                                        <span>Tặng bộ đề 600 câu hỏi VIP</span>
                                    </li>

                                    <li className='flex items-start gap-3 text-sm text-gray-700'>
                                        <span className='material-symbols-outlined text-green-500 text-lg'>check_circle</span>
                                        <span>Miễn phí 1h xe chip thi thử</span>
                                    </li>
                                </ul>
                                <Link to='/dangkykhoahoc' state={{ course: product.id, courseName: product.title, imageKey: product.image }} className='w-full bg-[#ff7a00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2'>
                                    <span>ĐĂNG KÝ TƯ VẤN NGAY</span>
                                    <span className='material-symbols-outlined text-lg'>arrow_forward</span>
                                </Link>
                                <p className='text-center text-xs text-gray-400'>
                                    Cam kết bảo mật thông tin 100%
                                </p>
                            </div>
                        </div>

                        {/* Hotline Support */}
                        <div className='bg-[#f0f9ff] border border-blue-100 p-5 rounded-xl flex items-center gap-4'>
                            <div className='bg-white p-3 rounded-full shadow-sm text-[#135bec] animate-bounce'>
                                <span className='material-symbols-outlined text-2xl'>call</span>
                            </div>
                            <div>
                                <p className='text-sm text-gray-600'>Bạn cần tư vấn gấp?</p>
                                <a className='text-xl font-black text-[#135bec] hover:text-blue-700' href="tel:0909123456">0909123456</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
