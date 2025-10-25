import { HotelRecommendation } from '../../api/ai-agent.api'

interface HotelCardProps {
  hotel: HotelRecommendation
  className?: string
}

export function HotelCard({ hotel, className = '' }: HotelCardProps) {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating.split('/')[0])
    const stars = Math.floor(numRating)
    const hasHalfStar = numRating % 1 >= 0.5
    
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < stars
                ? 'text-yellow-400'
                : i === stars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow duration-200 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 text-sm">{hotel.name}</h4>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">{hotel.price}</div>
          <div className="text-xs text-gray-500">per night</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {renderStars(hotel.rating)}
          <span className="text-xs text-gray-500">{hotel.distance}</span>
        </div>
        
        <p className="text-xs text-gray-600">{hotel.address}</p>
        
        {hotel.bookingUrl && (
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Book Now
          </a>
        )}
      </div>
    </div>
  )
}
