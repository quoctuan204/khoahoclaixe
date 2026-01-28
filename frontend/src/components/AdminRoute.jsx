import React from 'react'
import { useAuth } from '../context/AuthContext'
import NotFound from '../pages/NotFound'

const AdminRoute = ({ children, allowedRoles = [] }) => {
  const { isAdmin, role, loading } = useAuth()

  // Nếu đang tải thông tin xác thực, return null để tránh flash trang 404
  if (loading) return null

  // Nếu không phải admin, hiển thị trang 404 giả để ẩn đường dẫn
  if (!isAdmin) return <NotFound />

  // Nếu trang yêu cầu quyền cụ thể (ví dụ: ['superadmin']) mà user không có -> 404
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <NotFound />
  }
  
  return children
}

export default AdminRoute
