import React, { useState, useEffect, useRef } from 'react'

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Khi phần tử xuất hiện trong viewport
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Ngừng theo dõi sau khi đã hiện ra (chỉ chạy 1 lần)
          observer.unobserve(entry.target)
        }
      })
    }, { 
      threshold: 0.1, // Kích hoạt khi 10% phần tử hiển thị
      rootMargin: '0px 0px -50px 0px' // Offset một chút để hiệu ứng tự nhiên hơn
    })

    const currentRef = domRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default FadeIn