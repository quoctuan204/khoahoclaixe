import React from 'react'

const DeleteModal = ({ isOpen, onClose, onConfirm, title = 'Xác nhận xóa', message }) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
            <span className="material-symbols-outlined text-3xl">delete</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">
            {message || 'Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.'}
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/30"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
