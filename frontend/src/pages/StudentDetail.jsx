import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [courses, setCourses] = useState([])
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
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

  useEffect(() => {
    fetch(`${API_BASE}/api/products`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setCourses(data)
    }).catch(console.error)
  }, [API_BASE])

  useEffect(() => {
    if (!token) return; // Chờ token load xong từ LocalStorage mới gọi API
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/registrations/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          if (typeof data.address === 'object') {
            data.address = [data.address.ward, data.address.district, data.address.province].filter(Boolean).join(', ')
          }
          setFormData(data)
        } else {
          toast.error('Không tìm thấy học viên')
          navigate('/admin')
        }
      } catch {
        toast.error('Lỗi kết nối')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id, navigate, API_BASE, token]) // Bổ sung token vào theo dõi

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const selectedCourseObj = courses.find(c => c.id === formData.course)
      const dataToSend = {
        ...formData,
        courseName: selectedCourseObj ? selectedCourseObj.title : formData.courseName
      }

      const response = await fetch(`${API_BASE}/api/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSend)
      })
      if (response.ok) {
        toast.success('Cập nhật thông tin thành công')
        setIsEditing(false)
      } else {
        const err = await response.json()
        toast.error(err.message || 'Cập nhật thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='bg-blue-600 px-6 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold text-white'>Chi tiết học viên</h1>
          <div className='flex gap-2'>
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className='bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors font-medium'>
                  Hủy
                </button>
                <button onClick={handleSave} disabled={saving} className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors font-bold flex items-center gap-1 disabled:opacity-70'>
                  <span className="material-symbols-outlined text-[18px]">save</span> {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className='bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 font-medium'>
                  <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                </button>
                <button onClick={() => navigate('/admin')} className='text-white hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors'>
                  Quay lại
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Họ</label>
            <input name="lastName" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.lastName || ''} readOnly={!isEditing} />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Tên</label>
            <input name="firstName" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.firstName || ''} readOnly={!isEditing} />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Email</label>
            <input name="email" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.email || ''} readOnly={!isEditing} />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
            <input name="phone" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.phone || ''} readOnly={!isEditing} />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Khóa học</label>
            {isEditing ? (
              <select name="course" onChange={handleChange} value={formData.course || ''} className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900'>
                <option value="" disabled>Chọn khóa học</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                {!courses.find(c => c.id === formData.course) && formData.course && (
                  <option value={formData.course}>{formData.courseName || formData.course}</option>
                )}
              </select>
            ) : (
              <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.courseName || (formData.course === 'b1' ? 'Hạng B1' : formData.course === 'b2' ? 'Hạng B2' : formData.course === 'c' ? 'Hạng C' : formData.course || '')} readOnly />
            )}
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>CCCD</label>
            <input name="cccd" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.cccd || ''} readOnly={!isEditing} />
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
            <input name="address" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} value={formData.address || ''} readOnly={!isEditing} />
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Ghi chú</label>
            <textarea name="note" onChange={handleChange} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' : 'bg-gray-100 text-gray-600 cursor-not-allowed'}`} rows="3" value={formData.note || ''} readOnly={!isEditing} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentDetail