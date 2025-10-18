import { DetectedLocation, Video, VideoListItem, VideoProcessingResponse } from '@/types/video.type'

export class VideoTransformer {
  // Transform VideoProcessingResponse -> Video (sau khi upload)
  static fromProcessingResponse(response: VideoProcessingResponse): Video {
    return {
      id: response.video_id,
      name: response.video_info.filename.split('-')[0] || 'Processed Video',
      status: 'COMPLETED',
      userId: 'current-user', // Lấy từ auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      locations: response.locations,
      video_info: response.video_info
    }
  }

  // Transform VideoListItem -> Video (từ API list)
  static fromListItem(item: VideoListItem): Video {
    // Transform VideoLocation -> DetectedLocation
    const locations: DetectedLocation[] = item.locations.map((loc) => ({
      id: loc.id,
      original_name: loc.originalName,
      type: loc.type.toLowerCase() as 'restaurant' | 'store' | 'cafe',
      context: loc.context,
      google_place: {
        name: loc.googleName,
        formatted_address: loc.formattedAddress,
        location: {
          lat: loc.latitude,
          lng: loc.longitude
        },
        place_id: loc.placeId,
        types: loc.types,
        google_maps_url: loc.googleMapsUrl,
        error: loc.searchStatus === 'NOT_FOUND' ? 'Location not found' : undefined
      }
    }))

    return {
      id: item.id,
      name: item.originalName,
      status: item.status,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      locations,
      video_info: {
        filename: item.filename,
        size: item.fileSize,
        mimetype: item.mimeType,
        city: item.city,
        country: item.country
      },
      summary: item.summary || undefined
    }
  }
}
