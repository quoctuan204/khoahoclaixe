import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE =
  import.meta?.env?.VITE_API_BASE || 'http://localhost:5000'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [token, setToken] = useState(
    localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      null
  )
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  /*VERIFY TOKEN*/
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Unauthorized')

        const data = await res.json()
        setUser(data)
        setRole(data.role)
      } catch (err) {
        logout()
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  /* LOGIN */
  const login = ({ token, user, remember }) => {
    if (remember) {
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token')
    } else {
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token')
    }

    setToken(token)
    setUser(user)
    setRole(user?.role)

    navigate('/admin')
  }

  /* LOGOUT */
  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')

    setToken(null)
    setUser(null)
    setRole(null)

    navigate('/login')
  }

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }))
  }

  const value = {
    user,
    role,
    token,
    isAuthenticated: !!token,
    isAdmin: ['admin', 'superadmin', 'staff', 'ADMIN'].includes(role),
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
