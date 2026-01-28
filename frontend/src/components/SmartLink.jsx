import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LoadingContext } from '../context/LoadingContext'

const SmartLink = ({ to, onClick, children, ...rest }) => {
  const { setLoading } = useContext(LoadingContext)

  const handleClick = e => {
    if (onClick) onClick(e)
    // set loading state; the ScrollToTop effect will clear it on navigation
    setLoading && setLoading(true)
  }

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}

export default SmartLink
