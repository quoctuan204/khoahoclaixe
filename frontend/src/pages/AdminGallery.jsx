import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'

const AdminGallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  const [formData, setFormData] = useState({
    title: '',
    type: 'Hoạt động'
  })

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`)
      if (res.ok) {
        const data = await res.json()
        const processed = data.map(item => {
            let imgUrl = item.image;
            if (imgUrl) {
                imgUrl = imgUrl.replace(/\\/g, '/');
                if (imgUrl.startsWith('uploads/')) imgUrl = '/' + imgUrl;
                if (imgUrl.startsWith('/uploads/')) imgUrl = `${API_BASE}${imgUrl}`;
            }
            return { ...item, image: imgUrl };
        })
        setImages(processed)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      // 1. Upload file
      const uploadData = new FormData()
      uploadData.append('image', file)
      
      const uploadRes = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      })
      const uploadJson = await uploadRes.json().catch(() => ({}))
      
      if (!uploadRes.ok) {
        throw new Error(uploadJson.message || 'Tải ảnh lên thất bại')
      }
      
      if (!uploadJson.imageUrl) throw new Error('Upload failed')

      // 2. Save to Gallery DB
      const galleryData = {
        title: formData.title || file.name,
        type: formData.type,
        image: uploadJson.imageUrl
      }

      const saveRes = await fetch(`${API_BASE}/api/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(galleryData)
      })

      if (saveRes.ok) {
        toast.success('Tải ảnh lên thành công')
        setFormData({ title: '', type: 'Hoạt động' }) // Reset form
        fetchImages() // Refresh list
      } else {
        toast.error('Lưu ảnh thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return
    const reason = window.prompt('Vui lòng nhập lý do xóa:', 'Ảnh kém chất lượng')
    if (reason === null) return

    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      if (res.ok) {
        setImages(prev => prev.filter(img => img._id !== id))
        toast.success('Đã xóa ảnh')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Quản lý Thư viện ảnh</h1>

      {/* Upload Area */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8'>
        <h3 className='text-lg font-bold mb-4'>Tải ảnh mới</h3>
        <div className='flex flex-col md:flex-row gap-4 items-end'>
          <div className='flex-1 w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề ảnh (Tùy chọn)</label>
            <input 
              type="text" 
              className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              placeholder="Nhập tiêu đề..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className='w-full md:w-48'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Album</label>
            <select 
              className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Khóa học">Khóa học</option>
              <option value="Tin tức">Tin tức</option>
            </select>
          </div>
          <div className='w-full md:w-auto'>
             <label htmlFor="gallery-upload" className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <span className="material-symbols-outlined">cloud_upload</span>
                {uploading ? 'Đang tải...' : 'Chọn ảnh & Tải lên'}
             </label>
             <input id="gallery-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {loading ? <Skeleton className='h-64 w-full' /> : (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {images.map(img => (
            <div key={img._id} className='group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
              <img src={img.image || undefined} alt={img.title} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3'>
                 <span className='text-white text-xs font-bold bg-blue-600 px-2 py-1 rounded w-fit'>{img.type}</span>
                 {role !== 'staff' && (
                    <button onClick={() => handleDelete(img._id)} className='bg-red-600 text-white p-2 rounded-full self-end hover:bg-red-700'><span className="material-symbols-outlined text-sm">delete</span></button>
                 )}
              </div>
              <div className='absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs font-medium truncate'>{img.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGallery