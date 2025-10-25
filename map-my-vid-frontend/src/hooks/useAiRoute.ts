import { useMutation } from '@tanstack/react-query'
import { aiAgentApi, RoutePreferences, RouteResponse, AudioRouteResponse } from '../api/ai-agent.api'

export function useGenerateRoute() {
  return useMutation({
    mutationFn: (preferences?: RoutePreferences) => 
      aiAgentApi.generateRoute(preferences),
    onError: (error) => {
      console.error('Failed to generate route:', error)
    }
  })
}

export function useGenerateRouteWithAudio() {
  return useMutation({
    mutationFn: (audioBlob: Blob) => 
      aiAgentApi.generateRouteWithAudio(audioBlob),
    onError: (error) => {
      console.error('Failed to generate route with audio:', error)
    }
  })
}
