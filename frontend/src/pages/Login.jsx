import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const API_BASE =
    import.meta?.env?.VITE_API_BASE || 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // 👉 BƯỚC 1: LOGIN
      if (step === 1) {
        const res = await fetch(`${API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const data = await res.json()

        if (res.ok && data.require2FA) {
          setStep(2)
        } else if (res.ok) {
          login(data.user, remember)
          navigate('/dashboard')
        } else {
          setError(data.message || 'Đăng nhập thất bại')
        }
      }

      // 👉 BƯỚC 2: VERIFY 2FA
      else {
        const res = await fetch(`${API_BASE}/api/verify-2fa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, code })
        })

        const data = await res.json()

        if (res.ok) {
          login(data.user, remember)
          navigate('/dashboard')
        } else {
          setError(data.message || 'Mã xác thực không đúng')
        }
      }
    } catch (err) {
      console.error(err)
      setError('Không thể kết nối máy chủ')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-2">
          Đăng nhập quản trị
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Hệ thống quản lý học viên
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={step === 2}
            required
            className="w-full h-12 px-3 border rounded"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={step === 2}
            required
            className="w-full h-12 px-3 border rounded"
          />

          {step === 2 && (
            <input
              type="text"
              placeholder="Mã xác thực 6 số"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
              className="w-full h-12 px-3 border rounded"
            />
          )}

          {step === 1 && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {step === 1 ? 'Đăng nhập' : 'Xác thực'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login