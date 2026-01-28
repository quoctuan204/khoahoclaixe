import React, { useContext } from 'react'
import { LoadingContext } from '../context/LoadingContext'

const LoadingOverlay = () => {
  const { loading } = useContext(LoadingContext)
  if (!loading) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
      <div className='w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin' />
    </div>
  )
}

export default LoadingOverlay
