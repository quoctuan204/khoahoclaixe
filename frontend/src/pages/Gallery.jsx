import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../components/Skeleton'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song cả API News và Products
        const [newsRes, productsRes, galleryRes] = await Promise.all([
          fetch(`${API_BASE}/api/news`),
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/gallery`)
        ])

        const newsData = await newsRes.json()
        const productsData = await productsRes.json()
        const galleryData = galleryRes.ok ? await galleryRes.json() : []

        const allImages = []

        // Xử lý ảnh từ Tin tức
        if (Array.isArray(newsData)) {
          newsData.forEach(item => {
            if (item.image) {
              let src = item.image
              if (src.startsWith('/uploads/')) src = `${API_BASE}${src}`
              allImages.push({
                id: `news-${item._id}`,
                src: src,
                title: item.title,
                type: 'Tin tức',
                link: `/tin_tuc/${item._id}`
              })
            }
          })
        }

        // Xử lý ảnh từ Khóa học
        if (Array.isArray(productsData)) {
          productsData.forEach(item => {
            if (item.image) {
              let src = item.image
              if (src.startsWith('/uploads/')) src = `${API_BASE}${src}`
              allImages.push({
                id: `prod-${item.id}`,
                src: src,
                title: item.title,
                type: 'Khóa học',
                link: `/product/${item.id}`
              })
            }
          })
        }

        // Xử lý ảnh từ Gallery riêng
        if (Array.isArray(galleryData)) {
          galleryData.forEach(item => {
            let src = item.image
            if (src.startsWith('/uploads/')) src = `${API_BASE}${src}`
            allImages.push({
              id: `gal-${item._id}`,
              src: src,
              title: item.title,
              type: item.type === 'Hoạt động' ? 'Tin tức' : item.type, // Map 'Hoạt động' vào nhóm Tin tức/Sự kiện hoặc giữ nguyên nếu muốn tách riêng
              link: '#' // Ảnh gallery thường không có link bài viết
            })
          })
        }

        // Trộn ngẫu nhiên hoặc sắp xếp theo ngày (ở đây mình để mặc định)
        setImages(allImages)
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [API_BASE])

  const filteredImages = filter === 'all' ? images : images.filter(img => img.type === filter)

  return (
    <div className='py-16 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-black text-gray-900 sm:text-4xl'>Thư viện hình ảnh</h1>
          <p className='mt-4 text-lg text-gray-500'>Những khoảnh khắc đẹp tại trung tâm đào tạo lái xe.</p>
        </div>

        <div className='flex justify-center gap-3 mb-10 flex-wrap'>
          <button 
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#135bec] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setFilter('Khóa học')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === 'Khóa học' ? 'bg-[#135bec] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Khóa học
          </button>
          <button 
            onClick={() => setFilter('Tin tức')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === 'Tin tức' ? 'bg-[#135bec] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tin tức
          </button>
        </div>

        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className='h-64 w-full rounded-lg' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredImages.map((img) => (
              <div key={img.id} className='group relative overflow-hidden rounded-lg shadow-md cursor-pointer bg-white h-64'>
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                  onClick={() => setSelectedImage(img)}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                  <span className='text-xs text-blue-300 font-bold uppercase'>{img.type}</span>
                  <h3 className='text-white font-medium text-sm line-clamp-2'>{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal (Xem ảnh lớn) */}
        {selectedImage && (
          <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' onClick={() => setSelectedImage(null)}>
            <button className='absolute top-4 right-4 text-white hover:text-gray-300 z-50'>
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <div className='relative max-w-5xl w-full max-h-screen flex flex-col items-center' onClick={e => e.stopPropagation()}>
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className='max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl' 
              />
              <div className='mt-4 text-center'>
                <h3 className='text-white text-xl font-bold'>{selectedImage.title}</h3>
                <button 
                  onClick={() => {
                    setSelectedImage(null)
                    navigate(selectedImage.link)
                  }}
                  className='mt-2 text-blue-400 hover:text-blue-300 text-sm underline'
                >
                  Xem chi tiết bài viết/khóa học
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery