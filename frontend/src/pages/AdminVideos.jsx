import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'

const AdminVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/videos`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/api/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Thêm video thành công')
        setFormData({ title: '', url: '', description: '' })
        fetchVideos()
      } else {
        const err = await res.json()
        toast.error(err.message || 'Thêm thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa video này?')) return
    const reason = window.prompt('Vui lòng nhập lý do xóa:', 'Video bị lỗi')
    if (reason === null) return

    try {
      const res = await fetch(`${API_BASE}/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      if (res.ok) {
        setVideos(prev => prev.filter(v => v._id !== id))
        toast.success('Đã xóa video')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Quản lý Video YouTube</h1>

      {/* Add Form */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8'>
        <h3 className='text-lg font-bold mb-4'>Thêm Video Mới</h3>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Đường dẫn YouTube (URL)</label>
            <input 
              type="text" 
              className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tiêu đề</label>
            <input 
              type="text" 
              className='w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500'
              placeholder="Nhập tiêu đề video..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className='flex items-end'>
             <button type="submit" className='w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors'>
                <span className="material-symbols-outlined">add_circle</span> Thêm Video
             </button>
          </div>
        </form>
      </div>

      {/* Video List */}
      {loading ? <Skeleton className='h-64 w-full' /> : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {videos.map(video => (
            <div key={video._id} className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group'>
              <div className='relative aspect-video'>
                <img 
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                  alt={video.title} 
                  className='w-full h-full object-cover'
                />
                <a 
                  href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors'
                >
                  <span className="material-symbols-outlined text-white text-5xl opacity-80 group-hover:scale-110 transition-transform">play_circle</span>
                </a>
              </div>
              <div className='p-4'>
                <h4 className='font-bold text-gray-900 line-clamp-2 mb-2 h-12'>{video.title}</h4>
                <div className='flex justify-between items-center mt-2'>
                   <span className='text-xs text-gray-500'>{new Date(video.createdAt).toLocaleDateString('vi-VN')}</span>
                   {role !== 'staff' && (
                      <button onClick={() => handleDelete(video._id)} className='text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors'>
                         <span className="material-symbols-outlined">delete</span>
                      </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVideos