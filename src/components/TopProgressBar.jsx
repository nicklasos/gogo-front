import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './TopProgressBar.css'

const TopProgressBar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!isLoading) return null

  return (
    <div className="top-progress-bar">
      <div className="progress-bar-fill" />
    </div>
  )
}

export default TopProgressBar
