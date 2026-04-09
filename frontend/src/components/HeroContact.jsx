import React from 'react'

const HeroContact = () => {
  return (
    <div className='relative w-full bg-[#135bec]/5 py-12 lg:py-16'>
      <div className='absolute inset-0 opacity-10' style={{backgroundImage: 'radial-gradient(#135bec 1px, transparent 1px)',backgroundSize: '24px 24px',}}></div>
      <div className='layout-container max-w-7xl mx-auto px-4 lg:px-10 relative z-10 text-center'>
        <h1 className='text-[#111318] text-3xl lg:text-5xl font-black leading-tight tracking-tight mb-4'>
            Liên hệ &amp; Đăng ký
        </h1>
        <p className='text-[#616f89] text-base lg:text-lg max-w-2xl mx-auto'>
            Hãy để lại thông tin hoặc liên hệ trực tiếp với chúng tôi. Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn 24/7 để bắt đầu hành trình lái xe an toàn.
        </p>
      </div>
    </div>
  )
}

export default HeroContact
