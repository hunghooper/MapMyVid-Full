import React from 'react'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VideoUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
  uploadError?: boolean
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onFileUpload, isUploading, uploadError }) => {
  const { t } = useTranslation()

  return (
    <div className='rounded-lg border border-gray-200 p-4 sm:p-6'>
      <h2 className='mb-3 text-base font-medium text-gray-900 sm:mb-4 sm:text-lg'>{t('upload.title')}</h2>
      <label className='block'>
        <input
          type='file'
          accept='video/*'
          onChange={onFileUpload}
          className='sr-only'
          disabled={isUploading}
        />
        <div
          className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors sm:p-6 ${
            isUploading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-400'
          }`}
        >
          <Upload className='mx-auto mb-2 h-6 w-6 text-gray-400 sm:h-8 sm:w-8' />
          <p className='text-xs text-gray-600 sm:text-sm'>
            {isUploading ? t('upload.uploading') : t('upload.selectFile')}
          </p>
        </div>
      </label>

      {/* Upload Error */}
      {uploadError && (
        <div className='mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600'>
          Upload failed. Please try again.
        </div>
      )}
    </div>
  )
}

export default VideoUpload
