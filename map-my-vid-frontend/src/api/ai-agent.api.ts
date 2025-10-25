import http from "@/utils/http"

const path = {
  aiAgent: '/ai-agent'
}

export interface RoutePreferences {
  maxDistance?: number
  timeOfDay?: 'morning' | 'afternoon' | 'evening'
  transportation?: 'walking' | 'driving' | 'public_transport'
  duration?: number
}

export interface HotelRecommendation {
  name: string
  price: string
  rating: string
  distance: string
  address: string
  bookingUrl: string
}

export interface RouteItem {
  order: number
  locationId: string
  name: string
  estimatedDuration: string
  transportation: string
  notes: string
  hotelRecommendations?: HotelRecommendation[]
  location?: {
    id: string
    name: string
    type: string
    latitude: number
    longitude: number
    googleMapsUrl: string
    formattedAddress: string
  }
}

export interface RouteSummary {
  totalDuration: string
  totalDistance: string
  transportationMode: string
  bestTimeToStart: string
  isOvernightTrip?: boolean
  totalEstimatedCost?: string
}

export interface RouteResponse {
  route: RouteItem[]
  summary: RouteSummary
  recommendations: string[]
}

export interface AudioRouteResponse extends RouteResponse {
  audioUrl?: string
}

export const aiAgentApi = {
  // POST /api/ai-agent/generate-route
  generateRoute(preferences?: RoutePreferences) {
    return http.post<RouteResponse>(`${path.aiAgent}/generate-route`, {
      preferences
    })
  },

  // POST /api/ai-agent/generate-route-audio
  generateRouteWithAudio(audioBlob: Blob) {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    
    return http.post<AudioRouteResponse>(`${path.aiAgent}/generate-route-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
