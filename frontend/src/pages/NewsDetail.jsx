import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [loading, setLoading] = useState(true)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/news/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.image && data.image.startsWith('/uploads/')) {
            data.image = `${API_BASE}${data.image}`
          }
          setNews(data)

          // Fetch related news
          const resAll = await fetch(`${API_BASE}/api/news`)
          if (resAll.ok) {
            const allNews = await resAll.json()
            const related = allNews.filter(item => item._id !== id).slice(0, 3).map(item => {
              if (item.image && item.image.startsWith('/uploads/')) {
                return { ...item, image: `${API_BASE}${item.image}` }
              }
              return item
            })
            setRelatedNews(related)
          }
        } else {
          navigate('/tin_tuc')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchNewsDetail()
  }, [id, API_BASE, navigate])

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500">Đang tải...</div>
  if (!news) return null

  return (
    <div className='py-16 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <button 
          onClick={() => navigate('/tin_tuc')} 
          className='mb-8 flex items-center text-[#135bec] font-medium hover:underline transition-all'
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span> Quay lại tin tức
        </button>

        <article className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12'>
          <div className='p-6 md:p-10'>
            <div className='flex items-center gap-4 text-sm text-gray-500 mb-4'>
               <span className='bg-blue-50 text-[#135bec] px-3 py-1 rounded-full font-bold text-xs uppercase'>Tin tức</span>
               <time dateTime={news.createdAt}>{new Date(news.createdAt).toLocaleDateString('vi-VN')}</time>
            </div>

            <h1 className='text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight'>
              {news.title}
            </h1>

            {news.shortDescription && (
              <p className='text-xl text-gray-600 font-medium mb-8 italic border-l-4 border-[#135bec] pl-4'>
                {news.shortDescription}
              </p>
            )}

            <div className='prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed'>
              {news.content}
            </div>

            {news.image && (
              <div className='w-full mt-10 flex justify-start'>
                 <img src={news.image} alt={news.title} className='w-1/2 h-auto rounded-xl shadow-sm' />
              </div>
            )}
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#135bec] pl-3'>Bài viết liên quan</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
              {relatedNews.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => navigate(`/tin_tuc/${item._id}`)}
                  className='bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all group border border-gray-100'
                >
                  <div className='h-28 sm:h-48 overflow-hidden'>
                    <img 
                      src={item.image || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      alt={item.title} 
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
                    />
                  </div>
                  <div className='p-3 sm:p-4'>
                    <h4 className='text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-[#135bec] transition-colors'>
                      {item.title}
                    </h4>
                    <p className='text-[10px] sm:text-sm text-gray-500'>
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsDetail