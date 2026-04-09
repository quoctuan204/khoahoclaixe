import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import DeleteModal from '../components/DeleteModal'

const AdminNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/news`)
      if (res.ok) {
        const data = await res.json()
        const processedData = data.map(item => {
          if (item.image && item.image.startsWith('/uploads/')) {
            return { ...item, image: `${API_BASE}${item.image}` }
          }
          return item
        })
        setNews(processedData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`${API_BASE}/api/news/${deleteId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin xóa trực tiếp' })
      })
      if (res.ok) {
        toast.success('Đã xóa bài viết')
        setNews(prev => prev.filter(item => item._id !== deleteId))
      } else {
        toast.error('Xóa thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    } finally {
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex justify-between items-center mb-8'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-32' />
        </div>
        <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
          <div className='h-12 bg-gray-50 border-b border-gray-200'></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-20 border-b border-gray-100 flex items-center px-6 gap-6'>
              <Skeleton className='h-12 w-20 rounded' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Quản lý Tin tức</h1>
        <button 
          onClick={() => navigate('/admin/news/new')}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2'>
          <span className="material-symbols-outlined">add</span> Thêm bài viết
        </button>
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
        {/* Giao diện Desktop (Table) */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Hình ảnh</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Tiêu đề</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Ngày tạo</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Hành động</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {news.map(item => (
                <tr key={item._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {item.image && <img src={item.image} alt="" className='h-12 w-20 object-cover rounded border' />}
                  </td>
                  <td className='px-6 py-4 font-medium text-gray-900'>{item.title}</td>
                  <td className='px-6 py-4 text-gray-500 text-sm'>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button onClick={() => navigate(`/admin/news/${item._id}`)} className='text-[#135bec] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 inline-flex mr-2'>
                      <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                    </button>
                    {role !== 'staff' && (
                      <button onClick={() => handleDelete(item._id)} className='text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 inline-flex'>
                        <span className="material-symbols-outlined text-[18px]">delete</span> Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Giao diện Mobile (Card) */}
        <div className='md:hidden flex flex-col divide-y divide-gray-200'>
          {news.map(item => (
            <div key={item._id} className='p-4 bg-white hover:bg-gray-50 transition-colors'>
              <div className='flex gap-4 mb-3'>
                {item.image ? (
                  <img src={item.image} alt="" className='h-20 w-24 object-cover rounded-lg border border-gray-200 shrink-0' />
                ) : (
                  <div className='h-20 w-24 bg-gray-100 rounded-lg border border-gray-200 shrink-0 flex items-center justify-center text-gray-400'>
                    <span className="material-symbols-outlined">image</span>
                  </div>
                )}
                <div className='flex-1'>
                  <div className='text-sm font-bold text-gray-900 line-clamp-2 mb-1'>{item.title}</div>
                  <div className='text-xs text-gray-500 flex items-center gap-1 mt-2'>
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div className='flex gap-2 pt-3 border-t border-gray-100'>
                <button onClick={() => navigate(`/admin/news/${item._id}`)} className='flex-1 text-[#135bec] bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium text-sm'>
                  <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                </button>
                {role !== 'staff' && (
                  <button onClick={() => handleDelete(item._id)} className='flex-1 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium text-sm'>
                    <span className="material-symbols-outlined text-[18px]">delete</span> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xóa bài viết"
        message={<>Bạn có chắc chắn muốn xóa bài viết này không? <br/>Hành động này không thể hoàn tác.</>}
      />
    </div>
  )
}

export default AdminNews