import React, { useEffect, useState } from 'react'
import Skeleton from '../components/Skeleton'

const VideoLibrary = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingVideo, setPlayingVideo] = useState(null)
  
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'https://khoahoclaixe.onrender.com'

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/videos`)
        if (res.ok) {
          const data = await res.json()
          setVideos(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [API_BASE])

  return (
    <div className='py-16 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-black text-gray-900 sm:text-4xl'>Thư viện Video</h1>
          <p className='mt-4 text-lg text-gray-500'>Hướng dẫn lái xe, mẹo thi sát hạch và các video thực tế.</p>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-64 w-full rounded-xl' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {videos.map((video) => (
              <div key={video._id} className='bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100'>
                <div 
                  className='relative aspect-video cursor-pointer group'
                  onClick={() => setPlayingVideo(video.videoId)}
                >
                  <img 
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} 
                    alt={video.title} 
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors'>
                    <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                       <span className="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='font-bold text-gray-900 line-clamp-2 text-lg leading-snug'>{video.title}</h3>
                  {video.description && <p className='text-gray-500 text-sm mt-2 line-clamp-2'>{video.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Modal Player */}
        {playingVideo && (
          <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' onClick={() => setPlayingVideo(null)}>
            <button className='absolute top-4 right-4 text-white hover:text-gray-300 z-50'>
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <div className='w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl' onClick={e => e.stopPropagation()}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoLibrary