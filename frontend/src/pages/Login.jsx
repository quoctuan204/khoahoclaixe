import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { assets } from '../assets/assets'
import FadeIn from '../components/FadeIn'

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

const Login = () => {
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState('LOGIN') // 'LOGIN', 'FORGOT', 'RESET'
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      /* STEP 1: LOGIN */
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại')
        return
      }

      if (data.token) {
        login({
          token: data.token,
          user: data.user,
          remember
        })
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối máy chủ')
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      })
      const data = await res.json()
      if (res.ok) {
        setMode('RESET')
        setMessage(data.message)
        setCountdown(60) // Bắt đầu đếm ngược 60 giây
      } else {
        setError(data.message)
      }
    } catch {
      setError('Lỗi kết nối')
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/reset-password-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        setMode('LOGIN')
        setMessage(data.message)
        setResetCode('')
        setNewPassword('')
      } else {
        setError(data.message)
      }
    } catch {
      setError('Lỗi kết nối')
    }
  }

  const handleResend = async () => {
    setError('')
    setMessage('Đang gửi lại...')
    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Mã mới đã được gửi vào email!')
        setCountdown(60) // Reset lại đồng hồ đếm ngược
      } else {
        setError(data.message)
      }
    } catch {
      setError('Lỗi kết nối')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <FadeIn className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="Logo" className="h-20 w-auto object-contain" />
        </div>
        <h2 className="text-center text-3xl font-bold mb-6">
          {mode === 'LOGIN' ? 'Đăng nhập quản trị' : mode === 'FORGOT' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
        </h2>

        {/* FORM ĐĂNG NHẬP */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-12 px-3 border rounded"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-3 border rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Ghi nhớ
                </label>
                <button type="button" onClick={() => { setMode('FORGOT'); setError(''); setMessage('') }} className="text-blue-600 hover:underline">
                  Quên mật khẩu?
                </button>
              </div>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
            >
              Đăng nhập
            </button>
          </form>
        )}

        {/* FORM QUÊN MẬT KHẨU */}
        {mode === 'FORGOT' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">Nhập email đã đăng ký để nhận mã xác thực.</p>
            <input
              type="email"
              placeholder="Email của bạn"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="w-full h-12 px-3 border rounded"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full h-12 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">
              Gửi mã xác nhận
            </button>
            <button type="button" onClick={() => { setMode('LOGIN'); setError(''); setMessage('') }} className="w-full text-gray-500 text-sm hover:underline">
              Quay lại đăng nhập
            </button>
          </form>
        )}

        {/* FORM ĐẶT LẠI MẬT KHẨU */}
        {mode === 'RESET' && (
          <form onSubmit={handleReset} className="space-y-4">
            {message && <p className="text-green-600 text-sm text-center mb-2">{message}</p>}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-600">Mã xác nhận</label>
                {countdown > 0 ? (
                  <span className="text-sm text-red-500 font-bold">Hết hạn sau: {countdown}s</span>
                ) : (
                  <button 
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-blue-600 font-bold hover:underline"
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Nhập 6 số"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                className="w-full h-12 px-3 border rounded"
              />
            </div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full h-12 px-3 border rounded"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full h-12 bg-green-600 text-white rounded hover:bg-green-700 font-bold">
              Đổi mật khẩu
            </button>
            <button type="button" onClick={() => { setMode('LOGIN'); setError(''); setMessage('') }} className="w-full text-gray-500 text-sm hover:underline">
              Quay lại đăng nhập
            </button>
          </form>
        )}
      </FadeIn>
    </div>
  )
}

export default Login
