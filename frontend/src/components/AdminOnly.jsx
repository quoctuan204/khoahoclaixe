import React from 'react'
import { useAuth } from '../context/AuthContext'

const AdminOnly = ({ children }) => {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null
  return <>{children}</>
}

export default AdminOnly
