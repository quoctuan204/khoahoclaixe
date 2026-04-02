import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const AdminCourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState({
    id: '', // Thêm trường ID cho khóa học mới
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    duration: '',
    vehicle: '',
    image: '',
    highlights: '', // Sẽ xử lý dưới dạng chuỗi text (mỗi dòng 1 ý)
    theoryFee: '',
    examFee: '',
    isVisible: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/products/${id}`)
        let pDb = null
        if (r.ok) {
          pDb = await r.json()
        }
        
        const pLocal = products.find(x => x.id === id)

        if (!pDb && !pLocal) {
          toast.error('Khóa học không tồn tại')
          navigate('/admin/courses')
          return
        }

        const merged = { ...pLocal, ...pDb }
          
          if (merged.image && typeof merged.image === 'string' && merged.image.startsWith('/uploads/')) {
            merged.image = `${API_BASE}${merged.image}`
          }

          // Chuyển mảng highlights thành chuỗi để hiển thị trong textarea
          const highlightsStr = Array.isArray(merged.highlights) ? merged.highlights.join('\n') : ''

          setFormData({
            id: merged.id,
            title: merged.title || '',
            description: merged.description || '',
            price: merged.price || '',
            oldPrice: merged.oldPrice || '',
            duration: merged.duration || '',
            vehicle: merged.vehicle || '',
            image: merged.image || '',
            highlights: highlightsStr,
            theoryFee: merged.theoryFee || '',
            examFee: merged.examFee || '',
            isVisible: merged.isVisible !== false
          })
      } catch (error) {
        console.error(error)
        toast.error('Lỗi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate, API_BASE, isNew])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    // Chuyển đổi highlights từ chuỗi về mảng
    const highlightsArray = formData.highlights.split('\n').filter(line => line.trim() !== '')

    const url = isNew ? `${API_BASE}/api/products` : `${API_BASE}/api/products/${id}`
    const method = isNew ? 'POST' : 'PUT'

    try {
      let finalImage = formData.image

      if (imageFile) {
        const data = new FormData()
        data.append('image', imageFile)
        const uploadRes = await fetch(`${API_BASE}/api/upload`, { 
          method: 'POST', 
          headers: { 'Authorization': `Bearer ${token}` },
          body: data 
        })
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.message || 'Lỗi tải ảnh lên server');
        }
        const uploadJson = await uploadRes.json()
        if (uploadJson.imageUrl) {
          finalImage = uploadJson.imageUrl.startsWith('http') ? uploadJson.imageUrl : `${API_BASE}${uploadJson.imageUrl}`
        }
      }

      const imageToSave = finalImage.replace(API_BASE, '')
      const dataToSend = {
        ...formData,
        image: imageToSave,
        highlights: highlightsArray
      }

      const r = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      if (r.ok) {
        toast.success(isNew ? 'Thêm khóa học thành công!' : 'Cập nhật khóa học thành công!')
        if (isNew) navigate('/admin/courses')
      } else {
        const errData = await r.json().catch(() => ({}));
        toast.error(errData.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch {
      toast.error('Lỗi kết nối server')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>{isNew ? 'Thêm khóa học mới' : `Chỉnh sửa: ${id.toUpperCase()}`}</h2>
        <button onClick={() => navigate('/admin/courses')} className='text-gray-600 hover:text-gray-900'>Quay lại</button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Mã khóa học (ID)</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="id" value={formData.id} onChange={handleChange} placeholder="VD: b1-sotudong" disabled={!isNew} required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên khóa học</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="title" value={formData.title} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian đào tạo</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="duration" value={formData.duration} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Giá hiện tại</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="price" value={formData.price} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Giá cũ (Gạch ngang)</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="oldPrice" value={formData.oldPrice} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Loại xe tập</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="vehicle" value={formData.vehicle} onChange={handleChange} />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Phí Lý thuyết & Hồ sơ</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="theoryFee" value={formData.theoryFee} onChange={handleChange} placeholder="VD: 5.000.000đ" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Lệ phí thi</label>
            <input className='w-full border border-gray-300 rounded-lg p-2' name="examFee" value={formData.examFee} onChange={handleChange} placeholder="VD: 1.500.000đ" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Hình ảnh</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('course-file-upload').click()}
            >
              <input id="course-file-upload" type="file" onChange={handleImageChange} className='hidden' accept="image/*" />
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
              <p className="text-sm text-gray-500 font-medium">Kéo thả ảnh vào đây</p>
              <p className="text-xs text-gray-400 mt-1">hoặc click để chọn file</p>
            </div>
            {uploading && <p className='text-xs text-blue-500 mt-1'>Đang xử lý...</p>}
            {(preview || formData.image) && <img src={preview || formData.image} alt="Preview" className='mt-2 h-32 object-cover rounded border' />}
          </div>
          
          <div className='flex items-center gap-2 mt-2'>
            <input 
              type="checkbox" 
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
              className='w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer'
            />
            <label htmlFor="isVisible" className='text-sm font-medium text-gray-700 cursor-pointer select-none'>Hiển thị khóa học này trên trang chủ</label>
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả ngắn</label>
          <textarea className='w-full border border-gray-300 rounded-lg p-2' rows="3" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ghi chú / Điểm nổi bật (Mỗi dòng một ý)</label>
          <textarea className='w-full border border-gray-300 rounded-lg p-2 font-mono text-sm' rows="5" name="highlights" value={formData.highlights} onChange={handleChange} placeholder="- Điểm nổi bật 1&#10;- Điểm nổi bật 2" />
        </div>
        <div className='flex justify-end'>
          <button type="submit" disabled={uploading} className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-md disabled:bg-gray-400'>{isNew ? 'Tạo mới' : 'Lưu thay đổi'}</button>
        </div>
      </form>
    </div>
  )
}

export default AdminCourseDetail