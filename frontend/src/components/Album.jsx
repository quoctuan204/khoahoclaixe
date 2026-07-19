import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Album = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/gallery`)
        if (res.ok) {
          const data = await res.json()
          setHasMore(data.length > 6)
          // Lấy 6 ảnh mới nhất
          setImages(data.slice(0, 6).map(img => {
            let imgUrl = img.image;
            if (imgUrl) {
                imgUrl = imgUrl.replace(/\\/g, '/');
                if (imgUrl.startsWith('uploads/')) imgUrl = '/' + imgUrl;
                if (imgUrl.startsWith('/uploads/')) imgUrl = `${API_BASE}${imgUrl}`;
            }
            return { ...img, image: imgUrl };
          }))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [API_BASE])

  const getGridConfig = (count) => {
    if (count === 1) {
      return {
        container: 'grid grid-cols-1 h-[500px] gap-4',
        items: [
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-xl md:text-2xl', textContainerClass: 'bottom-6 left-6' }
        ]
      };
    }
    if (count === 2) {
      return {
        container: 'grid grid-cols-1 md:grid-cols-2 h-[500px] gap-4',
        items: [
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-xl', textContainerClass: 'bottom-6 left-6' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-xl', textContainerClass: 'bottom-6 left-6' }
        ]
      };
    }
    if (count === 3) {
      return {
        container: 'grid grid-cols-2 md:grid-cols-3 h-[500px] gap-4',
        items: [
          { gridClass: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2', titleClass: 'text-xl md:text-2xl', textContainerClass: 'bottom-6 left-6' },
          { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm md:text-base', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm md:text-base', textContainerClass: 'bottom-4 left-4' }
        ]
      };
    }
    if (count === 4) {
      return {
        container: 'grid grid-cols-2 md:grid-cols-4 grid-rows-2 h-[500px] gap-4',
        items: [
          { gridClass: 'col-span-2 row-span-2', titleClass: 'text-lg md:text-xl', textContainerClass: 'bottom-6 left-6' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-2 row-span-1', titleClass: 'text-sm md:text-base', textContainerClass: 'bottom-4 left-4' }
        ]
      };
    }
    if (count === 5) {
      return {
        container: 'grid grid-cols-2 md:grid-cols-4 grid-rows-2 h-[500px] gap-4',
        items: [
          { gridClass: 'col-span-2 row-span-2', titleClass: 'text-lg md:text-xl', textContainerClass: 'bottom-6 left-6' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
          { gridClass: 'col-span-1 row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' }
        ]
      };
    }
    // count >= 6
    return {
      container: 'grid grid-cols-2 md:grid-cols-6 grid-rows-2 h-[500px] gap-4',
      items: [
        { gridClass: 'col-span-2 row-span-2 md:col-span-3 md:row-span-2', titleClass: 'text-lg md:text-xl', textContainerClass: 'bottom-6 left-6' },
        { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
        { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
        { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
        { gridClass: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' },
        { gridClass: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1', titleClass: 'text-sm', textContainerClass: 'bottom-4 left-4' }
      ]
    };
  };

  const gridConfig = getGridConfig(images.length);

  return (
    <div className='py-16 lg:py-24 bg-[#f8f9fa]' id='thu-vien'>
      <div className='layout-container flex justify-center'>
        <div className='layout-content-container flex flex-col max-w-[1280px] w-full px-4 lg:px-10'>
            <div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-4'>
                <div className='max-w-2xl'>
                    <span className='text-[#f97316] font-bold uppercase tracking-wider text-sm'>
                        ALBUM
                    </span>
                    <h2 className='text-[#111318] text-3xl lg:text-4xl font-black mt-2'>
                        Hình ảnh
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        Một số hình ảnh thực tế tại sân tập và các buổi lễ tốt nghiệp của học viên.
                    </p>
                </div>
                {hasMore && (
                  <button 
                      onClick={() => navigate('/gallery')}
                      className='cursor-pointer hidden md:flex items-center gap-2 text-[#135bec] font-bold hover:text-blue-700 transition-colors'
                  >
                      Xem tất cả hình ảnh <span className='material-symbols-outlined'>arrow_forward</span>
                  </button>
                )}
            </div>

            {loading ? (
              <div className='grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]'>
                <div className='col-span-2 row-span-2 bg-gray-200 animate-pulse rounded-2xl'></div>
                <div className='bg-gray-200 animate-pulse rounded-2xl'></div>
                <div className='bg-gray-200 animate-pulse rounded-2xl'></div>
                <div className='col-span-2 bg-gray-200 animate-pulse rounded-2xl'></div>
              </div>
            ) : images.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400'>
                <span className="material-symbols-outlined text-6xl mb-3 text-gray-300">image</span>
                <p className='text-lg font-medium text-gray-500'>Chưa có hình ảnh</p>
              </div>
            ) : (
              <div className={gridConfig.container}>
                {images.map((img, index) => {
                  const config = gridConfig.items[index] || {};
                  return (
                    <div key={img._id || index} className={`${config.gridClass || ''} relative group overflow-hidden rounded-2xl`}>
                        <img src={img.image} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' alt={img.title || ""}/>
                        <div className='absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors'></div>
                        {(img.title || img.type) && (
                          <div className={`absolute ${config.textContainerClass || 'bottom-4 left-4'} text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                              {img.title && <h3 className={`font-bold ${config.titleClass || 'text-sm'}`}>{img.title}</h3>}
                              {img.type && <p className='text-xs text-gray-200'>{img.type}</p>}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <button 
                  onClick={() => navigate('/gallery')}
                  className='md:hidden mt-6 flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50'
              >
                  Xem thêm hình ảnh
              </button>
            )}
        </div>
      </div>
    </div>
  )
}

export default Album
