import { InsurancePackage } from '../../api/insurance.api'

interface InsuranceCardProps {
  insurance: InsurancePackage
  className?: string
}

export function InsuranceCard({ insurance, className = '' }: InsuranceCardProps) {
  const renderStars = (rating: number) => {
    const stars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
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
        <span className="text-sm text-gray-600 ml-1">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{insurance.name}</h3>
          <p className="text-sm text-gray-600">{insurance.provider}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${insurance.price.daily}</div>
          <div className="text-xs text-gray-500">per day</div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        {renderStars(insurance.rating)}
        <div className="text-sm text-gray-600">
          Coverage: {insurance.coverageLimit}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">{insurance.description}</p>

      {/* Coverage */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Coverage Includes:</h4>
        <div className="grid grid-cols-1 gap-1">
          {insurance.coverage.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </div>
          ))}
          {insurance.coverage.length > 3 && (
            <div className="text-xs text-gray-500 ml-6">
              +{insurance.coverage.length - 3} more items
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
        <div className="flex flex-wrap gap-2">
          {insurance.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing Options */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Pricing Options:</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">${insurance.price.daily}</div>
            <div className="text-xs text-gray-500">Daily</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">${insurance.price.weekly}</div>
            <div className="text-xs text-gray-500">Weekly</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">${insurance.price.monthly}</div>
            <div className="text-xs text-gray-500">Monthly</div>
          </div>
        </div>
      </div>

      {/* Recommended For */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended For:</h4>
        <div className="flex flex-wrap gap-1">
          {insurance.recommendedFor.map((type, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600">Emergency:</span>
            <span className="text-gray-900 ml-1">{insurance.emergencyContact}</span>
          </div>
          <div className="text-gray-600">
            Deductible: {insurance.deductible}
          </div>
        </div>
      </div>
    </div>
  )
}
