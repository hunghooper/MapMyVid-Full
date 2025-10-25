import React from 'react'

interface HeartIconProps {
  isFilled: boolean
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const HeartIcon: React.FC<HeartIconProps> = ({ 
  isFilled, 
  onClick, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} transition-colors duration-200 hover:scale-110 ${className}`}
      aria-label={isFilled ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isFilled ? '#dc2626' : 'none'}
        stroke={isFilled ? '#dc2626' : '#6b7280'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

export default HeartIcon
