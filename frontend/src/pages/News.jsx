import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const News = () => {
  const [news, setNews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6 // Số bài viết mỗi trang
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:5000'
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_BASE}/api/news`)
      .then(res => res.json())
      .then(data => {
        const processedData = data.map(item => {
          if (item.image && item.image.startsWith('/uploads/')) {
            return { ...item, image: `${API_BASE}${item.image}` }
          }
          return item
        })
        setNews(processedData)
      })
      .catch(err => console.error(err))
  }, [API_BASE])

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.shortDescription && item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className='py-16 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-black text-gray-900 sm:text-4xl'>Tin tức &amp; Sự kiện</h1>
          <p className='mt-4 text-lg text-gray-500'>Cập nhật những thông tin mới nhất về đào tạo lái xe và luật giao thông.</p>
        </div>

        {/* Search Bar */}
        <div className='flex justify-center mb-10'>
          <div className='relative w-full max-w-md'>
            <input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
            <div key={item._id} onClick={() => navigate(`/tin_tuc/${item._id}`)} className='flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer'>
              <div className='flex-shrink-0'>
                <img className='h-48 w-full object-cover' src={item.image || 'https://via.placeholder.com/400x200?text=No+Image'} alt={item.title} />
              </div>
              <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-[#135bec]'>
                    Tin tức
                  </p>
                  <div className='block mt-2'>
                    <p className='text-xl font-semibold text-gray-900'>{item.title}</p>
                    <p className='mt-3 text-base text-gray-500 line-clamp-3'>{item.shortDescription}</p>
                  </div>
                </div>
                <div className='mt-6 flex items-center'>
                  <div className='text-sm text-gray-500'>
                    <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</time>
                  </div>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không tìm thấy bài viết nào phù hợp.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredNews.length > itemsPerPage && (
          <div className='flex justify-center mt-12 gap-2'>
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#135bec] border-gray-300'}`}
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === i + 1 ? 'bg-[#135bec] text-white border-[#135bec]' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#135bec] border-gray-300'}`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default News
