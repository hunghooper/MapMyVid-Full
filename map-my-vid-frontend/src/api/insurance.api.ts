import { http } from '../utils/http'

const path = {
  insurance: '/api/insurance'
}

export interface InsurancePackage {
  id: string
  name: string
  provider: string
  coverage: string[]
  price: {
    daily: number
    weekly: number
    monthly: number
    currency: string
  }
  rating: number
  features: string[]
  description: string
  coverageLimit: string
  deductible: string
  emergencyContact: string
  claimProcess: string
  exclusions: string[]
  recommendedFor: string[]
}

export const insuranceApi = {
  getRecommendations(country: string, city?: string) {
    const params = new URLSearchParams({ country })
    if (city) {
      params.append('city', city)
    }
    return http.get<InsurancePackage[]>(`${path.insurance}?${params.toString()}`)
  },

  getAllCountries() {
    return http.get<string[]>(`${path.insurance}/countries`)
  },

  getPackageById(id: string) {
    return http.get<InsurancePackage>(`${path.insurance}/${id}`)
  }
}
