import React from 'react'

const Maintenance = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <span className="material-symbols-outlined text-9xl text-yellow-500 mb-6">engineering</span>
      <h1 className="text-4xl font-black text-gray-900 mb-4">Hệ thống đang bảo trì</h1>
      <p className="text-gray-600 text-lg max-w-md mx-auto">
        Chúng tôi đang tiến hành nâng cấp hệ thống để phục vụ bạn tốt hơn. 
        Vui lòng quay lại sau ít phút.
      </p>
      <div className="mt-8 text-sm text-gray-400">
        Xin lỗi vì sự bất tiện này.
      </div>
    </div>
  )
}

export default Maintenance