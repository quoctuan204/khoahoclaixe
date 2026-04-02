import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const AdminNewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const isNew = id === 'new'
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    image: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    if (!isNew) {
      fetch(`${API_BASE}/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.image && data.image.startsWith('/uploads/')) {
            data.image = `${API_BASE}${data.image}`
          }
          setFormData(data)
        })
        .catch(() => toast.error('Lỗi tải dữ liệu'))
    }
  }, [id, isNew, API_BASE])

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

    const url = isNew ? `${API_BASE}/api/news` : `${API_BASE}/api/news/${id}`
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

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, image: imageToSave })
      })

      if (res.ok) {
        toast.success(isNew ? 'Thêm mới thành công' : 'Cập nhật thành công')
        navigate('/admin/news')
      } else {
        toast.error('Có lỗi xảy ra')
      }
    } catch {
      toast.error('Lỗi kết nối')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>{isNew ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}</h2>
        <button onClick={() => navigate('/admin/news')} className='text-gray-600 hover:text-gray-900'>Quay lại</button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề</label>
          <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả ngắn</label>
          <textarea className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' rows="2" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Hình ảnh</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input id="file-upload" type="file" onChange={handleImageChange} className='hidden' accept="image/*" />
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
            <p className="text-sm text-gray-500 font-medium">Kéo thả ảnh vào đây</p>
            <p className="text-xs text-gray-400 mt-1">hoặc click để chọn file</p>
          </div>
          {uploading && <p className='text-xs text-blue-500 mt-1'>Đang xử lý...</p>}
          {(preview || formData.image) && <img src={preview || formData.image} alt="Preview" className='mt-2 h-40 object-cover rounded border' />}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Nội dung chi tiết</label>
          <textarea 
            className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[300px]' 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className='flex justify-end'>
          <button type="submit" disabled={uploading} className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-md disabled:bg-gray-400'>Lưu bài viết</button>
        </div>
      </form>
    </div>
  )
}

export default AdminNewsDetail