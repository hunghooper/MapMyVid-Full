import { useQuery, useMutation } from '@tanstack/react-query'
import { insuranceApi, InsurancePackage } from '../api/insurance.api'

export function useInsuranceRecommendations(country: string, city?: string) {
  return useQuery({
    queryKey: ['insurance', 'recommendations', country, city],
    queryFn: () => insuranceApi.getRecommendations(country, city),
    enabled: !!country,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAllCountries() {
  return useQuery({
    queryKey: ['insurance', 'countries'],
    queryFn: () => insuranceApi.getAllCountries(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useInsurancePackage(id: string) {
  return useQuery({
    queryKey: ['insurance', 'package', id],
    queryFn: () => insuranceApi.getPackageById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
