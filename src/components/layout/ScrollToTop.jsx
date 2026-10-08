import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Also scroll admin layout's scrollable content area
    const adminMain = document.getElementById('admin-main-content')
    if (adminMain) adminMain.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

export default ScrollToTop
