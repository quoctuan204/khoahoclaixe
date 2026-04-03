import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
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
    if (!token) return; // Chờ token load xong từ LocalStorage mới gọi API
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/registrations/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
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

  const formatAddress = (addr) => {
    if (!addr) return ''
    if (typeof addr === 'object') {
      return [addr.ward, addr.district, addr.province].filter(Boolean).join(', ')
    }
    return addr
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='bg-blue-600 px-6 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold text-white'>Chi tiết học viên</h1>
          <button onClick={() => navigate('/admin')} className='text-white hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors'>
            Quay lại
          </button>
        </div>
        
        <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Họ</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.lastName || ''} readOnly />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Tên</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.firstName || ''} readOnly />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Email</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.email || ''} readOnly />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.phone || ''} readOnly />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Khóa học</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.course === 'b1' ? 'Hạng B1' : formData.course === 'b2' ? 'Hạng B2' : formData.course === 'c' ? 'Hạng C' : formData.course || ''} readOnly />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>CCCD</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formData.cccd || ''} readOnly />
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
            <input className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' value={formatAddress(formData.address)} readOnly />
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Ghi chú</label>
            <textarea className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed' rows="3" value={formData.note || ''} readOnly />
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentDetail