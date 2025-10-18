import React from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Video } from '@/types/video.type'

interface VideoListProps {
  videos: Video[]
  selectedVideo: Video | null
  onSelectVideo: (video: Video) => void
  onDeleteVideo: (videoId: string) => void
}

const VideoList: React.FC<VideoListProps> = ({ videos, selectedVideo, onSelectVideo, onDeleteVideo }) => {
  const { t } = useTranslation()

  return (
    <div className='max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-4 sm:max-h-96 sm:p-6'>
      <h2 className='mb-3 text-base font-medium text-gray-900 sm:mb-4 sm:text-lg'>{t('videos.completed')}</h2>
      {videos.length === 0 ? (
        <p className='text-sm text-gray-500'>Bạn cần import video</p>
      ) : (
        <div className='space-y-2'>
          {videos.map((video: Video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className={`cursor-pointer rounded-lg p-2 transition-colors sm:p-3 ${
                selectedVideo?.id === video.id ? 'border border-gray-300 bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-gray-900 sm:text-base'>{video.name}</p>
                  <p className='mt-1 text-xs text-gray-500'>{new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteVideo(video.id)
                  }}
                  className='ml-2 p-1 text-gray-400 transition-colors hover:text-red-500'
                  aria-label={t('videos.delete')}
                >
                  <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoList
