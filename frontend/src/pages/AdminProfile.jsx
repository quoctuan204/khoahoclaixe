import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'

const AdminProfile = () => {
  const { token, user, updateUser } = useAuth()
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    avatar: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_BASE}/api/admin/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setProfile({
            fullName: data.fullName || '',
            email: data.email || '',
            avatar: data.avatar ? (data.avatar.startsWith('/uploads/') ? `${API_BASE}${data.avatar}` : data.avatar) : ''
          })
        } else {
          toast.error('Không thể tải thông tin hồ sơ.')
        }
      } catch (error) {
        toast.error('Lỗi kết nối khi tải hồ sơ.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [token, API_BASE])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Kích thước ảnh không được vượt quá 2MB.')
        return
      }
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (profile.email && !isValidEmail(profile.email)) {
      return toast.error('Địa chỉ email không đúng định dạng.')
    }

    setSaving(true)
    try {
      let avatarUrl = profile.avatar.replace(API_BASE, '')
      // 1. Upload new avatar if selected
      if (imageFile) {
        const uploadData = new FormData()
        uploadData.append('image', imageFile)
        const uploadRes = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: uploadData
        })
        const uploadResult = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Tải ảnh lên thất bại')
        avatarUrl = uploadResult.imageUrl // This is a relative path like /uploads/filename.jpg
      }

      // 2. Update profile data
      const updateData = {
        fullName: profile.fullName,
        email: profile.email,
        avatar: avatarUrl
      }

      const res = await fetch(`${API_BASE}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (res.ok) {
        toast.success('Cập nhật hồ sơ thành công!')
        updateUser({
          fullName: profile.fullName,
          email: profile.email,
          avatar: avatarUrl
        })
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Cập nhật thất bại.')
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto'>
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Hồ sơ của tôi</h1>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6'>
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='relative'>
            <img 
              src={preview || profile.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=96`} 
              alt="Avatar" 
              className='w-24 h-24 rounded-full object-cover border-4 border-white shadow-md'
            />
            <label htmlFor="avatar-upload" className='absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow'>
              <span className="material-symbols-outlined text-sm">edit</span>
            </label>
            <input id="avatar-upload" type="file" className='hidden' accept="image/*" onChange={handleImageChange} />
          </div>
          <div className='text-center sm:text-left'>
            <h2 className='text-2xl font-bold text-gray-800'>{profile.fullName || user?.username}</h2>
            <p className='text-gray-500'>{user?.username}</p>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Họ và tên</label>
          <input 
            type="text" 
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='Nhập họ và tên đầy đủ'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
          <input 
            type="email" 
            name="email"
            value={profile.email}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='Nhập địa chỉ email'
          />
          <p className='text-xs text-gray-500 mt-1'>* Email này sẽ được dùng để lấy lại mật khẩu khi bạn quên.</p>
        </div>

        <div className='flex justify-end'>
          <button 
            type="submit" 
            disabled={saving}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProfile