import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/products'
import DeleteModal from '../components/DeleteModal'

const AdminCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`)
      if (res.ok) {
        const dbProducts = await res.json()
        
        const mergedStatic = products.map(p => {
            const dbP = dbProducts.find(dp => dp.id === p.id)
            const finalP = dbP ? { ...p, ...dbP } : p
            if (finalP.image && typeof finalP.image === 'string' && finalP.image.startsWith('/uploads/')) {
              finalP.image = `${API_BASE}${finalP.image}`
            }
            return finalP
        })

        const newFromDb = dbProducts.filter(dp => !products.find(p => p.id === dp.id)).map(dp => {
            if (dp.image && typeof dp.image === 'string' && dp.image.startsWith('/uploads/')) {
              return { ...dp, image: `${API_BASE}${dp.image}` }
            }
            return dp
        })

        setCourses([...mergedStatic, ...newFromDb])
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi tải danh sách khóa học')
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
      const res = await fetch(`${API_BASE}/api/products/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin xóa trực tiếp' })
      })
      if (res.ok) {
        setCourses(prev => prev.filter(c => c.id !== deleteId))
        toast.success('Xóa thành công')
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
          <Skeleton className='h-10 w-56' />
          <Skeleton className='h-10 w-40' />
        </div>
        <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
          <div className='h-12 bg-gray-50 border-b border-gray-200'></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-20 border-b border-gray-100 flex items-center px-6 gap-6'>
              <Skeleton className='h-12 w-20 rounded' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-3 w-24' />
              </div>
              <Skeleton className='h-8 w-24 rounded' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Quản lý Khóa học</h1>
        <button 
          onClick={() => navigate('/admin/courses/new')}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2'>
          <span className="material-symbols-outlined">add</span> Thêm khóa học
        </button>
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Hình ảnh</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tên khóa học</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Giá hiện tại</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Thời gian</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Hành động</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {courses.map((product) => (
                <tr key={product.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <img src={product.image || undefined} alt={product.title} className='h-12 w-20 object-cover rounded-md border border-gray-200' />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-bold text-gray-900'>{product.title}</div>
                    <div className='text-xs text-gray-500'>ID: {product.id}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-bold text-[#135bec]'>{product.price}</div>
                    <div className='text-xs text-gray-400 line-through'>{product.oldPrice}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {product.duration}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button 
                      onClick={() => navigate(`/admin/courses/${product.id}`)}
                      className='text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 inline-flex mr-2'>
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Sửa
                    </button>
                    {role !== 'staff' && (
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className='text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 inline-flex'>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xóa khóa học"
        message={<>Bạn có chắc chắn muốn xóa khóa học này không? <br/>Hành động này không thể hoàn tác.</>}
      />
    </div>
  )
}

export default AdminCourses