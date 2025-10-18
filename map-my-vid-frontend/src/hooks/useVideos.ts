import { videoApi } from '@/api/video.api'
import type { Video } from '@/types/video.type'
import { VideoTransformer } from '@/utils/videoTransformer'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Hook để fetch danh sách videos
export function useVideos(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['videos', page, pageSize],
    queryFn: async () => {
      const response = await videoApi.getVideos(page, pageSize)
      const videos = response.data.data.map(VideoTransformer.fromListItem)
      const res = {
        videos: videos,
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / response.data.pageSize)
        }
      }
      return res
    }
  })
}

// Hook để upload video
export function useUploadVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) => videoApi.uploadVideo(file, name),

    onMutate: async ({ name }) => {
      await queryClient.cancelQueries({ queryKey: ['videos'] })

      const pendingVideo: Video = {
        id: 'pending-temp-id',
        name: name.substring(0, name.lastIndexOf('.')) || name,
        status: 'PROCESSING',
        userId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        locations: [],
        video_info: { filename: '', size: 0, mimetype: '', city: '', country: '' }
      }

      // Optimistically add pending video
      queryClient.setQueryData(['videos', 1, 20], (old: any) => {
        if (!old) return { videos: [pendingVideo], pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 } }
        return {
          ...old,
          videos: [pendingVideo, ...old.videos]
        }
      })

      return { pendingVideo }
    },

    onSuccess: (response, variables, context) => {
      const processedVideo = VideoTransformer.fromProcessingResponse(response.data)

      queryClient.setQueryData(['videos', 1, 20], (old: any) => {
        if (!old) return { videos: [processedVideo], pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 } }

        const filteredVideos = old.videos.filter((v: Video) => v.id !== 'pending-temp-id')
        return {
          ...old,
          videos: [processedVideo, ...filteredVideos]
        }
      })
    },

    onError: (error, variables, context) => {
      // Remove pending video on error
      queryClient.setQueryData(['videos', 1, 20], (old: any) => {
        if (!old) return old
        return {
          ...old,
          videos: old.videos.filter((v: Video) => v.id !== 'pending-temp-id')
        }
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'videos' })
    }
  })
}

// Hook để delete video
export function useDeleteVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (videoId: string) => videoApi.deleteVideo(videoId),

    onSuccess: (_, videoId) => {
      queryClient.setQueryData(['videos', 1, 20], (old: any) => {
        if (!old) return old
        return {
          ...old,
          videos: old.videos.filter((v: Video) => v.id !== videoId)
        }
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    }
  })
}
