import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'

const DownloadForms = () => {
  const [forms, setForms] = useState(null)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    fetch(`${API_BASE}/api/forms`).then(res => res.json()).then(data => setForms(data)).catch(err => console.error(err))
  }, [API_BASE])

  return (
    <div className='min-h-[70vh] bg-gray-50 py-16 lg:py-24'>
      <div className='max-w-4xl mx-auto px-4 lg:px-10'>
        <FadeIn>
          <div className='text-center mb-10'>
            <h1 className='text-3xl lg:text-4xl font-black text-gray-900 mb-4'>Tải Biểu Mẫu Đăng Ký</h1>
            <p className='text-gray-600'>Học viên vui lòng tải các biểu mẫu dưới đây, in ra và điền đầy đủ thông tin để hoàn thiện hồ sơ.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-blue-50 text-[#135bec] rounded-full flex items-center justify-center mb-6'>
                <span className='material-symbols-outlined text-3xl'>description</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Đơn đề nghị học, sát hạch</h3>
              <p className='text-sm text-gray-500 mb-8 flex-1'>Mẫu đơn đăng ký chính thức dùng để nộp lên Sở GTVT.</p>
              {forms?.form1Url ? (
                <a href={forms.form1Url.startsWith('http') ? forms.form1Url : `${API_BASE}${forms.form1Url}`} target='_blank' rel='noreferrer' download className='w-full bg-[#135bec] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2'><span className='material-symbols-outlined'>download</span> Tải xuống</a>
              ) : (
                <button disabled className='w-full bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed'>Đang cập nhật</button>
              )}
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6'>
                <span className='material-symbols-outlined text-3xl'>medical_information</span>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Biểu mẫu thứ 2</h3>
              <p className='text-sm text-gray-500 mb-8 flex-1'>Dành cho Giấy khám sức khỏe hoặc các cam kết khác.</p>
              {forms?.form2Url ? (
                <a href={forms.form2Url.startsWith('http') ? forms.form2Url : `${API_BASE}${forms.form2Url}`} target='_blank' rel='noreferrer' download className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2'><span className='material-symbols-outlined'>download</span> Tải xuống</a>
              ) : (
                <button disabled className='w-full bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed'>Đang cập nhật</button>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default DownloadForms