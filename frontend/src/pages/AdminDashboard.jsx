import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { token, role } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const navigate = useNavigate()
  
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/registrations`)
        if (response.ok) {
          const data = await response.json()
          setRegistrations(data)
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend (Port 5000).')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [API_BASE])

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus])

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'contacted' ? 'pending' : 'contacted'
    try {
      const response = await fetch(`${API_BASE}/api/registrations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        setRegistrations(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item))
        toast.success('Cập nhật trạng thái thành công')
      } else {
        toast.error('Cập nhật thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này không?')) {
      const reason = window.prompt('Vui lòng nhập lý do xóa:', 'Thay đổi ý định')
      if (reason === null) return // Người dùng ấn Hủy

      try {
        const response = await fetch(`${API_BASE}/api/registrations/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        })
        if (response.ok) {
          setRegistrations(prev => prev.filter(item => item._id !== id))
          toast.success('Xóa thành công!')
        } else {
          toast.error('Xóa thất bại. Vui lòng thử lại.')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Có lỗi xảy ra.')
      }
    }
  }

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <Skeleton className='h-10 w-64' />
          <div className='flex gap-4 w-full md:w-auto'>
            <Skeleton className='h-10 w-full md:w-64' />
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-10 w-32' />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
          <Skeleton className='h-[200px] rounded-lg' />
          <Skeleton className='h-[200px] rounded-lg' />
          <Skeleton className='h-[200px] lg:col-span-2 rounded-lg' />
        </div>

        <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
          <div className='h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6'>
             <Skeleton className='h-4 w-full' />
          </div>
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 flex-col gap-2">
        <span className="material-symbols-outlined text-4xl">error</span>
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  const filteredRegistrations = registrations.filter(item => {
    const term = searchTerm.toLowerCase()
    const fullName = `${item.lastName || ''} ${item.firstName || ''}`.toLowerCase()
    const phone = (item.phone || '').toLowerCase()
    const matchesSearch = fullName.includes(term) || phone.includes(term)

    if (filterStatus === 'all') return matchesSearch
    const status = item.status || 'pending'
    return matchesSearch && status === filterStatus
  }).sort((a, b) => {
    const statusA = a.status || 'pending'
    const statusB = b.status || 'pending'
    
    // Ưu tiên trạng thái 'pending' (Chưa liên hệ) lên đầu
    if (statusA === 'pending' && statusB !== 'pending') return -1
    if (statusA !== 'pending' && statusB === 'pending') return 1
    
    // Sắp xếp theo thời gian gửi: Gửi trước (cũ hơn) đứng trước
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  const handleExportExcel = () => {
    const dataToExport = filteredRegistrations.map((item, index) => ({
      'STT': index + 1,
      'Ngày gửi': new Date(item.createdAt).toLocaleDateString('vi-VN'),
      'Họ và Tên': `${item.lastName || ''} ${item.firstName || ''}`.trim(),
      'Email': item.email || '',
      'Số điện thoại': item.phone || '',
      'Khóa học': item.courseName || item.course?.toUpperCase() || '',
      'Trạng thái': item.status === 'contacted' ? 'Đã liên hệ' : 'Chưa liên hệ',
      'CCCD': item.cccd || '',
      'Địa chỉ': item.address || '',
      'Ghi chú': item.note || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đăng ký")
    XLSX.writeFile(workbook, "DanhSachHocVien.xlsx")
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: 'admin', // Mặc định user admin
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Đổi mật khẩu thành công!')
        setShowPasswordModal(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch {
      toast.error('Lỗi kết nối server')
    }
  }

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage)

  const stats = [
    { name: 'Hạng B1', count: registrations.filter(r => r.course === 'b1').length, fill: '#22c55e' },
    { name: 'Hạng B2', count: registrations.filter(r => r.course === 'b2').length, fill: '#3b82f6' },
    { name: 'Hạng C', count: registrations.filter(r => r.course === 'c').length, fill: '#eab308' },
  ]

  const pieData = [
    { name: 'Đã liên hệ', value: registrations.filter(r => r.status === 'contacted').length, fill: '#22c55e' },
    { name: 'Chưa liên hệ', value: registrations.filter(r => r.status !== 'contacted').length, fill: '#f97316' },
  ]

  return (
    <div className='w-full'>
      <div className='w-full'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Danh sách đăng ký học viên</h1>
          <div className='flex items-center gap-4 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <input
                type="text"
                placeholder="Tìm tên hoặc SĐT..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            </div>
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa liên hệ</option>
              <option value="contacted">Đã liên hệ</option>
            </select>
            <span className='bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap'>
              Tổng số: {filteredRegistrations.length}
            </span>
            <button 
              onClick={handleExportExcel}
              className='bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap'>
              <span className="material-symbols-outlined text-[20px]">download</span>
              Xuất Excel
            </button>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className='bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap'>
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Thống kê biểu đồ */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center items-center'>
            <h3 className='text-gray-500 text-sm font-medium uppercase tracking-wider'>Tổng số học viên</h3>
            <p className='text-5xl font-black text-gray-900 mt-4'>{registrations.length}</p>
            <p className='text-sm text-gray-400 mt-2'>Hồ sơ đăng ký</p>
          </div>
          
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center'>
            <h3 className='text-gray-900 font-bold mb-2 w-full text-left'>Tỷ lệ xử lý</h3>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-gray-900 font-bold mb-6'>Thống kê theo khóa học</h3>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>STT</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ngày gửi</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Họ và Tên</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Số điện thoại</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Khóa học</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Trạng thái</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>CCCD</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Địa chỉ</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ghi chú</th>
                  <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Hành động</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const isOverdue = (item.status !== 'contacted') && (new Date() - new Date(item.createdAt) > 3 * 24 * 60 * 60 * 1000)
                    return (
                    <tr key={item._id} className={`transition-colors ${isOverdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                      <td className='px-3 py-3 whitespace-nowrap text-sm text-gray-500'>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                          {isOverdue && <span className="material-symbols-outlined text-red-500 text-[18px]" title="Quá hạn 3 ngày chưa liên hệ">warning</span>}
                        </div>
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{item.lastName} {item.firstName}</div>
                        <div className='text-sm text-gray-500'>{item.email}</div>
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap text-sm text-gray-900'>
                        {item.phone}
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap'>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.course === 'b1' ? 'bg-green-100 text-green-800' : 
                            item.course === 'b2' ? 'bg-blue-100 text-blue-800' : 
                            item.course === 'c' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.courseName || item.course?.toUpperCase()}
                        </span>
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap'>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${(item.status === 'contacted') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.status === 'contacted' ? 'Đã liên hệ' : 'Chưa liên hệ'}
                        </span>
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap text-sm text-gray-500'>
                        {item.cccd || '-'}
                      </td>
                      <td className='px-3 py-3 text-sm text-gray-500 max-w-xs truncate' title={item.address}>
                        {item.address || '-'}
                      </td>
                      <td className='px-3 py-3 text-sm text-gray-500 max-w-xs truncate' title={item.note}>
                        {item.note || '-'}
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap text-sm font-medium'>
                        <button 
                          onClick={() => handleStatusChange(item._id, item.status || 'pending')}
                          className={`px-3 py-1 rounded-md transition-colors mr-2 text-xs font-medium border ${item.status === 'contacted' ? 'text-gray-600 border-gray-300 hover:bg-gray-50' : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'}`}>
                          {item.status === 'contacted' ? 'Hoàn tác' : 'Xác nhận LH'}
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/student/${item._id}`)}
                          className='text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors mr-2'>
                          Chi tiết
                        </button>
                        {role !== 'staff' && (
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className='text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors'>
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  )})
                ) : (
                  <tr>
                    <td colSpan="8" className='px-6 py-10 text-center text-gray-500'>
                      {registrations.length === 0 ? 'Chưa có dữ liệu đăng ký nào.' : 'Không tìm thấy kết quả phù hợp.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredRegistrations.length > itemsPerPage && (
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-xl'>
            <h3 className='text-xl font-bold mb-4 text-gray-900'>Đổi mật khẩu Admin</h3>
            <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu mới</label>
                <input 
                  type="password" 
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <div className='flex justify-end gap-3 mt-2'>
                <button type="button" onClick={() => setShowPasswordModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'>Hủy</button>
                <button type="submit" className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard