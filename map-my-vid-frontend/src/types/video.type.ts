export interface GooglePlaceInfo {
  name: string
  formatted_address: string
  location: {
    lat: number
    lng: number
  }
  place_id: string
  types: string[]
  google_maps_url: string
  error?: string
}

export interface DetectedLocation {
  id: string
  original_name: string
  type: string
  context: string
  google_place: GooglePlaceInfo
}

export interface VideoInfo {
  filename: string
  size: number
  mimetype: string
  city: string
  country: string
}

// Response từ POST /api/video-analyzer/analyze
export interface VideoProcessingResponse {
  success: boolean
  video_id: string
  video_info: VideoInfo
  locations_found: number
  locations: DetectedLocation[]
  processing_time_ms: number
}

// Location từ GET /api/video-analyzer/videos
export interface VideoLocation {
  id: string
  videoId: string
  originalName: string
  type: string
  context: string
  aiAddress: string
  googleName: string
  formattedAddress: string
  latitude: number
  longitude: number
  placeId: string
  rating: number | null
  googleMapsUrl: string
  types: string[]
  searchStatus: 'FOUND' | 'NOT_FOUND' | 'PENDING'
  createdAt: string
  updatedAt: string
}

// Video item từ GET /api/video-analyzer/videos
export interface VideoListItem {
  id: string
  userId: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  duration: number | null
  city: string
  country: string
  summary: string | null
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  errorMessage: string | null
  processingTimeMs: number | null
  createdAt: string
  updatedAt: string
  locations: VideoLocation[]
}

export interface VideoListResponse {
  data: VideoListItem[]
  total: number
  page: number
  pageSize: number
}

// Unified Video type cho UI (transform từ cả 2 APIs)
export interface Video {
  id: string
  name: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  userId: string
  createdAt: string
  updatedAt: string
  locations: DetectedLocation[]
  video_info: VideoInfo
  summary?: string
}
