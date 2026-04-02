import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const AdminForms = () => {
  const { token } = useAuth()
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({ form1Url: '', form1Name: '', form2Url: '', form2Name: '' })
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/forms`).then(res => res.json()).then(data => {
      setFormData({
        form1Url: data.form1Url || '', form1Name: data.form1Name || '',
        form2Url: data.form2Url || '', form2Name: data.form2Name || ''
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [API_BASE])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let updatedData = { ...formData }
      const uploadFile = async (file) => {
        const fData = new FormData()
        fData.append('file', file)
        const res = await fetch(`${API_BASE}/api/upload-doc`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fData })
        return await res.json()
      }

      if (file1) {
        const json1 = await uploadFile(file1)
        if (json1.fileUrl) { updatedData.form1Url = json1.fileUrl; updatedData.form1Name = json1.fileName }
      }
      if (file2) {
        const json2 = await uploadFile(file2)
        if (json2.fileUrl) { updatedData.form2Url = json2.fileUrl; updatedData.form2Name = json2.fileName }
      }

      const saveRes = await fetch(`${API_BASE}/api/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedData)
      })

      if (saveRes.ok) {
        toast.success('Cập nhật biểu mẫu thành công')
        setFormData(updatedData)
        setFile1(null); setFile2(null);
      } else { toast.error('Lỗi khi lưu dữ liệu') }
    } catch (error) { toast.error('Lỗi kết nối') } finally { setUploading(false) }
  }

  if (loading) return <div className='w-full h-64 animate-pulse bg-gray-200 rounded-lg'></div>

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>Quản lý Biểu mẫu Đăng ký</h1>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-8'>
        <div>
          <h3 className='text-lg font-bold text-[#135bec] mb-4'>1. Đơn đề nghị học, sát hạch</h3>
          {formData.form1Url && (
            <div className='mb-3 text-sm text-green-600 flex items-center gap-2'>
              <span className='material-symbols-outlined'>check_circle</span> Đã tải lên: <a href={formData.form1Url.startsWith('http') ? formData.form1Url : `${API_BASE}${formData.form1Url}`} target='_blank' rel='noreferrer' className='font-bold underline'>{formData.form1Name || 'Xem file'}</a>
            </div>
          )}
          <input type='file' accept='.pdf,.doc,.docx' onChange={e => setFile1(e.target.files[0])} className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer' />
        </div>

        <div className='pt-6 border-t border-gray-100'>
          <h3 className='text-lg font-bold text-[#135bec] mb-4'>2. File biểu mẫu số 2 (VD: Giấy khám sức khỏe)</h3>
          {formData.form2Url && (
            <div className='mb-3 text-sm text-green-600 flex items-center gap-2'>
              <span className='material-symbols-outlined'>check_circle</span> Đã tải lên: <a href={formData.form2Url.startsWith('http') ? formData.form2Url : `${API_BASE}${formData.form2Url}`} target='_blank' rel='noreferrer' className='font-bold underline'>{formData.form2Name || 'Xem file'}</a>
            </div>
          )}
          <input type='file' accept='.pdf,.doc,.docx' onChange={e => setFile2(e.target.files[0])} className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer' />
        </div>

        <div className='pt-6 border-t border-gray-100 flex justify-end'>
          <button type='submit' disabled={uploading} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50'><span className='material-symbols-outlined'>save</span> {uploading ? 'Đang lưu...' : 'Lưu biểu mẫu'}</button>
        </div>
      </form>
    </div>
  )
}

export default AdminForms