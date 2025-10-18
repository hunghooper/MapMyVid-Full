import path from '@/constants/path'
import { VideoListItem, VideoProcessingResponse } from '@/types/video.type'
import http from '@/utils/http'

export const videoApi = {
  uploadVideo(file: File, name: string) {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('name', name)

    return http.post<VideoProcessingResponse>(path.analyze, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async getVideos(page = 1, pageSize = 20) {
    return http.get<VideoListItem>(path.videos, {
      params: {
        page,
        pageSize
      }
    })
  },
  deleteVideo(videoId: string) {
    return http.delete(`${path.videos}/${videoId}`)
  },
  getVideoById(videoId: string) {
    return http.get<{ data: VideoListItem }>(`${path.videos}/${videoId}`)
  }
}
