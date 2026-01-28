import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LoadingContext } from '../context/LoadingContext'

const SmartNavLink = ({ to, onClick, children, ...rest }) => {
  const { setLoading } = useContext(LoadingContext)

  const handleClick = e => {
    if (onClick) onClick(e)
    setLoading && setLoading(true)
  }

  return (
    <NavLink to={to} onClick={handleClick} {...rest}>
      {children}
    </NavLink>
  )
}

export default SmartNavLink
