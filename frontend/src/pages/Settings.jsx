import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const [formData, setFormData] = useState({
    centerName: '',
    address: '',
    hotline: '',
    email: '',
    zalo: '',
    facebook: ''
  })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings`)
        if (res.ok) {
          const data = await res.json()
          setFormData(data)
        }
      } catch (error) {
        console.error(error)
        toast.error('Lỗi tải cài đặt')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [API_BASE])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Lưu cài đặt thành công')
      } else {
        toast.error('Lưu thất bại')
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi kết nối')
    }
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Cài đặt hệ thống</h2>
      <form onSubmit={handleSubmit} className='space-y-4 max-w-2xl'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tên trung tâm</label>
          <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="centerName" value={formData.centerName} onChange={handleChange} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Địa chỉ</label>
          <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Hotline</label>
            <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="hotline" value={formData.hotline} onChange={handleChange} />
            </div>
            <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="email" value={formData.email} onChange={handleChange} />
            </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Link Zalo</label>
            <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="zalo" value={formData.zalo} onChange={handleChange} />
            </div>
            <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Link Facebook</label>
            <input className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none' name="facebook" value={formData.facebook} onChange={handleChange} />
            </div>
        </div>
        <button type="submit" className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>Lưu thay đổi</button>
      </form>
    </div>
  )
}

export default Settings