import React from 'react'
import { assets } from '../assets/assets'

const FloatingContact = () => {
  return (
    <div className='fixed bottom-4 right-4 flex flex-col gap-4 z-50 animate-pulse'>
      {/* Phone */}
      <a
        href="tel:+84123456789"
        className='w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300'
        title="Gọi điện"
      >
        <span className='material-symbols-outlined'>phone</span>
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/123456789"
        target="_blank"
        rel="noopener noreferrer"
        className='w-12 h-12 bg-white hover:bg-gray-100 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-gray-300'
        title="Liên hệ Zalo"
      >
        <img src={assets.zalo} alt="Zalo" className='w-10 h-10' />
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className='w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300'
        title="Liên hệ Messenger"
      >
        <img src={assets.facebook} alt="Messenger" className='w-10 h-10' />
      </a>
    </div>
  )
}

export default FloatingContact