import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'

const AdminContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { token } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contacts`)
      if (res.ok) {
        const data = await res.json()
        setContacts(data)
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa yêu cầu này?')) return
    try {
      const res = await fetch(`${API_BASE}/api/contacts/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setContacts(prev => prev.filter(item => item._id !== id))
        toast.success('Đã xóa thành công')
      } else {
        toast.error('Xóa thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'contacted' ? 'pending' : 'contacted'
    try {
      const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setContacts(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item))
        toast.success('Cập nhật trạng thái thành công')
      } else {
        toast.error('Cập nhật thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const statusA = a.status || 'pending'
    const statusB = b.status || 'pending'
    
    // Ưu tiên trạng thái 'pending' (Chưa liên hệ) lên đầu
    if (statusA === 'pending' && statusB !== 'pending') return -1
    if (statusA !== 'pending' && statusB === 'pending') return 1
    
    // Sắp xếp theo thời gian gửi: Gửi trước (cũ hơn) đứng trước
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  const handleExportExcel = () => {
    const dataToExport = sortedContacts.map((item, index) => ({
      'STT': index + 1,
      'Họ tên': item.fullname,
      'Số điện thoại': item.phone,
      'Khóa học quan tâm': item.course || 'Chưa chọn',
      'Nội dung tư vấn': item.note || '',
      'Trạng thái': item.status === 'contacted' ? 'Đã liên hệ' : 'Chờ xử lý',
      'Ngày gửi': new Date(item.createdAt).toLocaleDateString('vi-VN')
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "YeuCauTuVan")
    XLSX.writeFile(workbook, "DanhSachTuVan.xlsx")
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedContacts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage)

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex justify-between items-center mb-8'>
          <Skeleton className='h-10 w-64' />
          <Skeleton className='h-10 w-32' />
        </div>
        <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
          <div className='h-12 bg-gray-50 border-b border-gray-200'></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-16 border-b border-gray-100 flex items-center px-6 gap-4'>
              <Skeleton className='h-4 w-8' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-full' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Danh sách Yêu cầu Tư vấn</h1>
        <button 
          onClick={handleExportExcel}
          className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'>
          <span className="material-symbols-outlined">download</span> Xuất Excel
        </button>
      </div>

      <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>STT</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Họ tên</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>SĐT</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Khóa học</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Nội dung</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Trạng thái</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Ngày gửi</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Hành động</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentItems.map((item, index) => (
              <tr key={item._id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className='px-6 py-4 font-medium text-gray-900'>{item.fullname}</td>
                <td className='px-6 py-4 text-gray-900'>{item.phone}</td>
                <td className='px-6 py-4 text-gray-500'>{item.course}</td>
                <td className='px-6 py-4 text-gray-500 max-w-xs truncate' title={item.note}>{item.note}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.status === 'contacted' ? 'Đã liên hệ' : 'Chờ xử lý'}
                  </span>
                </td>
                <td className='px-6 py-4 text-gray-500 text-sm'>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button 
                    onClick={() => handleStatusChange(item._id, item.status)}
                    className={`mr-2 px-3 py-1 rounded transition-colors ${item.status === 'contacted' ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
                    {item.status === 'contacted' ? 'Hoàn tác' : 'Đã liên hệ'}
                  </button>
                  <button onClick={() => handleDelete(item._id)} className='text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded'>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts.length > itemsPerPage && (
        <div className='flex justify-center items-center mt-6 gap-2'>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Trước
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminContacts