import { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { LoadingContext } from '../context/LoadingContext'

const ScrollToTop = () => {
  const { setLoading } = useContext(LoadingContext)
  const location = useLocation()

  useEffect(() => {
    // scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // clear loading overlay if any
    setLoading && setLoading(false)
  }, [location.pathname])

  return null
}

export default ScrollToTop
