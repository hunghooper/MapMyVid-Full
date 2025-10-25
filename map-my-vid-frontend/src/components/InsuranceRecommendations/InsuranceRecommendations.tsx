import { useState, useEffect } from 'react'
import { useInsuranceRecommendations, useAllCountries } from '../../hooks/useInsurance'
import { InsuranceCard } from '../InsuranceCard'

interface InsuranceRecommendationsProps {
  className?: string
}

export function InsuranceRecommendations({ className = '' }: InsuranceRecommendationsProps) {
  const [selectedCountry, setSelectedCountry] = useState('vietnam')
  const [selectedCity, setSelectedCity] = useState('')

  const { data: countries = [] } = useAllCountries()
  const { data: insurancePackages = [], isLoading, error } = useInsuranceRecommendations(selectedCountry, selectedCity)

  const countryOptions = [
    { value: 'vietnam', label: 'Vietnam' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'japan', label: 'Japan' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'philippines', label: 'Philippines' }
  ]

  const cityOptions: Record<string, string[]> = {
    vietnam: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang'],
    thailand: ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Pattaya'],
    japan: ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Sapporo'],
    singapore: ['Singapore'],
    malaysia: ['Kuala Lumpur', 'Penang', 'Langkawi', 'Malacca'],
    indonesia: ['Jakarta', 'Bali', 'Yogyakarta', 'Bandung'],
    philippines: ['Manila', 'Cebu', 'Boracay', 'Palawan']
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Travel Insurance Recommendations</h2>
        <p className="text-gray-500 text-sm">Get personalized insurance recommendations for your destination</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value)
                setSelectedCity('')
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
            >
              {countryOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City (Optional)</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select a city</option>
              {cityOptions[selectedCountry]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
          </div>
          <p className="text-gray-500">Loading insurance recommendations...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-2">Failed to load insurance recommendations</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && insurancePackages.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Recommended Insurance Packages
            </h3>
            <span className="text-sm text-gray-500">
              {insurancePackages.length} package{insurancePackages.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {insurancePackages.map((insurance) => (
              <InsuranceCard key={insurance.id} insurance={insurance} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && insurancePackages.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">No insurance packages found</p>
          <p className="text-gray-500 text-sm">Try selecting a different country or city</p>
        </div>
      )}
    </div>
  )
}
