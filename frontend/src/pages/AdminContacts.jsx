import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'
import DeleteModal from '../components/DeleteModal'

const AdminContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  useEffect(() => {
    if (token) fetchContacts()
  }, [token])

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
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

  const handleDelete = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`${API_BASE}/api/contacts/${deleteId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin xóa trực tiếp' })
      })
      if (res.ok) {
        setContacts(prev => prev.filter(item => item._id !== deleteId))
        toast.success('Đã xóa thành công')
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

  const filteredContacts = contacts.filter(item => {
    const matchesSearch = (item.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.phone || '').includes(searchTerm);
    
    const isChatbot = (item.note || '').includes('Hệ thống AI tự động thu thập');
    let matchesSource = true;
    if (sourceFilter === 'chatbot') matchesSource = isChatbot;
    if (sourceFilter === 'website') matchesSource = !isChatbot;

    return matchesSearch && matchesSource;
  })

  const sortedContacts = [...filteredContacts].sort((a, b) => {
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
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>Yêu cầu Tư vấn</h1>
        <button 
          onClick={handleExportExcel}
          className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium w-full md:w-auto justify-center'>
          <span className="material-symbols-outlined text-[20px]">download</span> Xuất Excel
        </button>
      </div>

      {/* Filters & Search */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 relative'>
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc SĐT..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          />
        </div>
        <select 
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
          className='w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white'>
          <option value="all">Tất cả nguồn</option>
          <option value="chatbot">Từ AI Chatbot</option>
          <option value="website">Từ Form Website</option>
        </select>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className='hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
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
                  {role !== 'staff' && (
                    <button onClick={() => handleDelete(item._id)} className='text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors inline-flex items-center justify-center' title="Xóa">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden space-y-4'>
        {currentItems.map((item) => (
          <div key={item._id} className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <h3 className='font-bold text-gray-900 text-lg'>{item.fullname}</h3>
                <a href={`tel:${item.phone}`} className='text-blue-600 font-medium text-sm flex items-center gap-1 mt-1'>
                  <span className="material-symbols-outlined text-[16px]">call</span> {item.phone}
                </a>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.status === 'contacted' ? 'Đã LH' : 'Chờ XL'}
              </span>
            </div>
            
            <div className='text-sm text-gray-600 space-y-2 mb-4'>
              <p><span className='font-semibold'>Khóa học:</span> {item.course}</p>
              <p><span className='font-semibold'>Ngày gửi:</span> {new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
              {item.note && <p className='bg-gray-50 p-2 rounded italic text-gray-500'>"{item.note}"</p>}
            </div>

            <div className='flex gap-2 pt-3 border-t border-gray-100'>
              <button 
                onClick={() => handleStatusChange(item._id, item.status)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${item.status === 'contacted' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {item.status === 'contacted' ? 'Hoàn tác' : 'Xác nhận LH'}
              </button>
              {role !== 'staff' && (
                <button 
                  onClick={() => handleDelete(item._id)}
                  className='px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium border border-red-100 flex items-center justify-center' title="Xóa">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
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

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xóa yêu cầu tư vấn"
        message={<>Bạn có chắc chắn muốn xóa yêu cầu này không? <br/>Hành động này không thể hoàn tác.</>}
      />
    </div>
  )
}

export default AdminContacts