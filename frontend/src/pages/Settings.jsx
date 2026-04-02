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
    facebook: '',
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const { token, role } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  // Admin Management State
  const [admins, setAdmins] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'admin'
  })
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [editForm, setEditForm] = useState({
    username: '',
    password: '', // Để trống nếu không đổi
    fullName: '',
    email: '',
    role: 'admin'
  })
  const [showEditModal, setShowEditModal] = useState(false)

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            centerName: data.centerName || '',
            address: data.address || '',
            hotline: data.hotline || '',
            email: data.email || '',
            zalo: data.zalo || '',
            facebook: data.facebook || '',
            maintenanceMode: data.maintenanceMode || false
          })
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

  useEffect(() => {
    if (activeTab === 'admins' && role === 'superadmin') {
      const fetchData = async () => {
        setAdminLoading(true)
        try {
          const res = await fetch(`${API_BASE}/api/admins`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data)) setAdmins(data);
          }
        } catch (error) {
          console.error(error)
        } finally {
          setAdminLoading(false)
        }
      }
      fetchData()
    }
  }, [activeTab, role, token, API_BASE])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'maintenanceMode' ? e.target.checked : value }))
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

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    if (newAdmin.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Tạo tài khoản thành công')
        setNewAdmin({ username: '', password: '', fullName: '', role: 'admin' })
        // Refresh list
        const refreshRes = await fetch(`${API_BASE}/api/admins`, { headers: { 'Authorization': `Bearer ${token}` } })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          if (Array.isArray(data)) setAdmins(data)
        }
      } else {
        toast.error(data.message || 'Tạo thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleEditClick = (admin) => {
    setEditingAdmin(admin)
    setEditForm({
      username: admin.username,
      password: '', // Reset password field
      fullName: admin.fullName || '',
      email: admin.email || '',
      role: admin.role
    })
    setShowEditModal(true)
  }

  const handleUpdateAdmin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/api/admins/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Cập nhật thành công')
        setShowEditModal(false)
        // Refresh list
        const refreshRes = await fetch(`${API_BASE}/api/admins`, { headers: { 'Authorization': `Bearer ${token}` } })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          if (Array.isArray(data)) setAdmins(data)
        }
      } else {
        toast.error(data.message || 'Cập nhật thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleResetPassword = async (id, username) => {
    const newPassword = window.prompt(`Nhập mật khẩu mới cho tài khoản ${username}:`)
    if (newPassword === null) return // Người dùng ấn Hủy
    
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/admins/${id}/reset-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleUnlock = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/admins/${id}/unlock`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success('Đã mở khóa tài khoản')
        // Refresh list
        const refreshRes = await fetch(`${API_BASE}/api/admins`, { headers: { 'Authorization': `Bearer ${token}` } })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          if (Array.isArray(data)) setAdmins(data)
        }
      } else {
        toast.error('Mở khóa thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) return
    const reason = window.prompt('Vui lòng nhập lý do xóa:', 'Nhân viên nghỉ việc')
    if (reason === null) return

    try {
      const res = await fetch(`${API_BASE}/api/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      if (res.ok) {
        toast.success('Đã xóa tài khoản')
        setAdmins(prev => prev.filter(a => a._id !== id))
      } else {
        const data = await res.json()
        toast.error(data.message || 'Xóa thất bại')
      }
    } catch {
      toast.error('Lỗi kết nối')
    }
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Cài đặt hệ thống</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('general')}
        >
          Thông tin chung
        </button>
        {role === 'superadmin' && (
          <button 
            className={`py-2 px-4 font-medium transition-colors ${activeTab === 'admins' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('admins')}
          >
            Quản lý tài khoản
          </button>
        )}
      </div>

      {activeTab === 'general' ? (
        <form onSubmit={handleSubmit} className='space-y-4 max-w-2xl'>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-yellow-800">Chế độ bảo trì</h3>
              <p className="text-sm text-yellow-700">Khi bật, chỉ Admin mới có thể truy cập website.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="maintenanceMode" className="sr-only peer" checked={formData.maintenanceMode} onChange={handleChange} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

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
      ) : (
        <div className='space-y-8'>
          {/* Create Admin Form */}
          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>Tạo tài khoản mới</h3>
            <form onSubmit={handleCreateAdmin} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end'>
              <input className='border p-2 rounded' placeholder='Tên đăng nhập' value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})} required />
              <input className='border p-2 rounded' type='password' placeholder='Mật khẩu' value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
              <input className='border p-2 rounded' placeholder='Họ tên (Tùy chọn)' value={newAdmin.fullName} onChange={e => setNewAdmin({...newAdmin, fullName: e.target.value})} />
              <select className='border p-2 rounded' value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}>
                <option value="admin">Admin</option>
                <option value="staff">Nhân viên</option>
                <option value="sale">Sale</option>
                <option value="superadmin">Super Admin</option>
              </select>
              <button type='submit' className='bg-green-600 text-white p-2 rounded hover:bg-green-700'>Thêm mới</button>
            </form>
          </div>

          {/* Admin List */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-gray-800'>Danh sách tài khoản</h3>
            {adminLoading ? <div>Đang tải...</div> : (admins && admins.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 border'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Username</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Họ tên</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Quyền hạn</th>
                      <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Hành động</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {admins.map(admin => (
                      <tr key={admin._id}>
                        <td className='px-4 py-2'>{admin.username}</td>
                        <td className='px-4 py-2'>{admin.fullName || '-'}</td>
                        <td className='px-4 py-2'>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className='px-4 py-2'>
                          {admin.lockUntil && new Date(admin.lockUntil) > new Date() && (
                            <button onClick={() => handleUnlock(admin._id)} className='text-orange-600 hover:text-orange-800 text-sm font-medium mr-3'>
                              Mở khóa
                            </button>
                          )}
                          <button onClick={() => handleResetPassword(admin._id, admin.username)} className='text-blue-600 hover:text-blue-800 text-sm font-medium mr-3'>Reset Pass</button>
                          <button onClick={() => handleEditClick(admin)} className='text-green-600 hover:text-green-800 text-sm font-medium mr-3'>Sửa</button>
                          <button onClick={() => handleDeleteAdmin(admin._id)} className='text-red-600 hover:text-red-800 text-sm font-medium'>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500">Chưa có tài khoản nào.</p>)}
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-xl'>
            <h3 className='text-xl font-bold mb-4 text-gray-900'>Chỉnh sửa tài khoản</h3>
            <form onSubmit={handleUpdateAdmin} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Tên đăng nhập</label>
                <input className='w-full border p-2 rounded' value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} required />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu mới (Để trống nếu không đổi)</label>
                <input className='w-full border p-2 rounded' type='text' placeholder='Nhập mật khẩu mới...' value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                <p className='text-xs text-gray-500 mt-1'>* Nhập vào đây để đổi mật khẩu và xem trực tiếp.</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Họ tên</label>
                <input className='w-full border p-2 rounded' value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input className='w-full border p-2 rounded' value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Quyền hạn</label>
                <select className='w-full border p-2 rounded' value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="staff">Nhân viên</option>
                  <option value="sale">Sale</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className='flex justify-end gap-3 mt-4'>
                <button type="button" onClick={() => setShowEditModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'>Hủy</button>
                <button type="submit" className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings