import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'

const AdminBanners = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { token } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  const [imageFiles, setImageFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: 'Đăng ký tư vấn',
    link: '/lien_he'
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/banners`)
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
        setBanners(processed)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      if (editingId) {
        setImageFiles([files[0]])
        setPreviews([URL.createObjectURL(files[0])])
      } else {
        setImageFiles(prev => [...prev, ...files]) // Cộng dồn ảnh mới vào danh sách cũ
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
      }
    }
    e.target.value = null // Reset để có thể chọn lại file vừa chọn nếu muốn
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index]) // Xóa URL ảo để tránh rò rỉ bộ nhớ
      return newPreviews.filter((_, i) => i !== index)
    })
  }

  const handleEdit = (banner) => {
    setEditingId(banner._id)
    setExistingImage(banner.image)
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      buttonText: banner.buttonText || 'Đăng ký tư vấn',
      link: banner.link || '/lien_he'
    })
    setImageFiles([])
    setPreviews([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setExistingImage(null)
    setFormData({ title: '', description: '', buttonText: 'Đăng ký tư vấn', link: '/lien_he' })
    setImageFiles([])
    setPreviews([])
  }

  const handleSave = async () => {
    if (!editingId && imageFiles.length === 0) return toast.error('Vui lòng chọn ít nhất 1 ảnh')
    setUploading(true)
    try {
      if (editingId) {
        let finalImage = existingImage;
        if (imageFiles.length > 0) {
          const uploadData = new FormData()
          uploadData.append('image', imageFiles[0])
          const uploadRes = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: uploadData
          })
          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.message || 'Lỗi tải ảnh lên server');
          }
          const uploadJson = await uploadRes.json()
          if (uploadJson.imageUrl) finalImage = uploadJson.imageUrl
        }

        const bannerData = {
          ...formData,
          image: finalImage ? finalImage.replace(API_BASE, '') : ''
        }

        const saveRes = await fetch(`${API_BASE}/api/banners/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bannerData)
        })

        if (saveRes.ok) {
          toast.success('Cập nhật banner thành công')
          handleCancelEdit()
          fetchBanners()
        } else {
          toast.error('Cập nhật thất bại')
        }
      } else {
        let successCount = 0
        for (const file of imageFiles) {
          const uploadData = new FormData()
          uploadData.append('image', file)
          
          const uploadRes = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: uploadData
          })
          
          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => ({}));
            throw new Error(errData.message || 'Lỗi tải ảnh lên server');
          }
          
          const uploadJson = await uploadRes.json()
          if (!uploadJson.imageUrl) continue

          const bannerData = {
            ...formData,
            image: uploadJson.imageUrl.replace(API_BASE, '')
          }

          const saveRes = await fetch(`${API_BASE}/api/banners`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bannerData)
          })

          if (saveRes.ok) successCount++
        }

        if (successCount > 0) {
          toast.success(`Đã thêm ${successCount} banner thành công`)
          handleCancelEdit()
          fetchBanners()
        } else {
          toast.error('Lưu thất bại')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return

    try {
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin xóa trực tiếp' })
      })
      if (res.ok) {
        setBanners(prev => prev.filter(b => b._id !== id))
        toast.success('Đã xóa banner')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Quản lý Banner Trang chủ</h1>

      {/* Upload Area */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8'>
        <h3 className='text-lg font-bold mb-4'>{editingId ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề lớn</label>
                <input 
                    type="text" 
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder="VD: Vững tay lái - Trọn niềm tin"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả ngắn</label>
                <input 
                    type="text" 
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder="VD: Trung tâm đào tạo lái xe chuẩn quốc tế..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tên nút bấm</label>
                <input 
                    type="text" 
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
                    value={formData.buttonText}
                    onChange={e => setFormData({...formData, buttonText: e.target.value})}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Link nút bấm</label>
                <input 
                    type="text" 
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
                    value={formData.link}
                    onChange={e => setFormData({...formData, link: e.target.value})}
                />
            </div>
        </div>
        
        <div className='flex flex-col gap-4'>
             <div className='flex items-center gap-4'>
                <label htmlFor="banner-upload" className={`cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors`}>
                    <span className="material-symbols-outlined">image</span>
                    {editingId ? 'Đổi ảnh nền' : 'Chọn ảnh nền'}
                </label>
                <input id="banner-upload" type="file" className="hidden" accept="image/*" multiple={!editingId} onChange={handleFileSelect} disabled={uploading} />
                <p className="text-sm text-gray-500">Khuyên dùng ảnh kích thước lớn (1920x1080)</p>
             </div>

             {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((src, index) => (
                        <div key={index} className="relative group">
                            <img src={src} alt={`Preview ${index}`} className='h-24 w-full object-cover rounded-lg border border-gray-300' />
                            <button 
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                                type="button"
                                title="Xóa ảnh này"
                            >
                                <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                            </button>
                        </div>
                    ))}
                </div>
             ) : (editingId && existingImage && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative group">
                        <img src={existingImage} alt="Existing" className='h-24 w-full object-cover rounded-lg border border-gray-300' />
                    </div>
                </div>
             )}

             <div className='flex gap-4'>
               <button 
                  onClick={handleSave}
                  disabled={uploading || (!editingId && imageFiles.length === 0)}
                  className={`w-fit bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${uploading || (!editingId && imageFiles.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span className="material-symbols-outlined">save</span>
                  {uploading ? 'Đang lưu...' : `Lưu`}
               </button>
               {editingId && (
                 <button 
                    onClick={handleCancelEdit}
                    disabled={uploading}
                    className={`w-fit bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="material-symbols-outlined">cancel</span>
                    Hủy sửa
                 </button>
               )}
             </div>
        </div>
      </div>

      {/* Banner List */}
      {loading ? <Skeleton className='h-64 w-full' /> : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {banners.map(banner => (
            <div key={banner._id} className='group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
              <img src={banner.image || undefined} alt={banner.title} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white'>
                 <h3 className='font-bold text-xl mb-1'>{banner.title || '(Không có tiêu đề)'}</h3>
                 <p className='text-sm opacity-90 line-clamp-2'>{banner.description}</p>
              </div>
              <div className='absolute top-4 right-4 flex gap-2'>
                <button 
                  onClick={() => handleEdit(banner)} 
                  className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg transition-opacity'
                  title="Sửa banner"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(banner._id)} 
                  className='bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg transition-opacity'
                  title="Xóa banner"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBanners