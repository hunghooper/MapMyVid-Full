import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { VideoStatus, LocationType, SearchStatus } from '@prisma/client'
import { GeminiService } from './services/gemini.service.js'
import { GoogleMapsService } from './services/google-maps.service.js'
import { FinalResponseDto } from './dto/video-analysis.dto.js'
import { PrismaService } from '../../database/prisma.service.js'
import { S3Service } from '../../common/utils/s3.service.js'
import { ERROR_MESSAGES } from '../../common/constants/error-messages.js'

@Injectable()
export class VideoAnalyzerService {
  private readonly logger = new Logger(VideoAnalyzerService.name)

  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private googleMapsService: GoogleMapsService,
    private s3: S3Service
  ) {}

  async analyzeVideoAndFindLocations(
    userId: string,
    videoInput: string | Buffer,
    filename: string,
    originalName: string,
    size: number,
    mimetype: string
  ): Promise<FinalResponseDto> {
    if (!userId || !videoInput || !filename || !originalName) {
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.MISSING_PARAMETERS)
    }

    if (size > 100 * 1024 * 1024) { // 100MB limit
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.FILE_TOO_LARGE)
    }

    if (!mimetype.startsWith('video/')) {
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.INVALID_FILE_TYPE)
    }

    const startTime = Date.now()

    try {
      const video = await this.prisma.video.create({
        data: {
          userId,
          filename,
          originalName,
          fileSize: size,
          mimeType: mimetype,
          status: VideoStatus.PROCESSING
        }
      })

      try {
        // Upload to S3 for storage (optional); keep key by user/date
        const key = `videos/${userId}/${filename}`
        if (videoInput instanceof Buffer) {
          await this.s3.uploadBuffer(key, videoInput, mimetype)
        }

        const aiAnalysis = await this.geminiService.analyzeVideo(videoInput)

        await this.prisma.video.update({
          where: { id: video.id },
          data: { city: aiAnalysis.city, country: aiAnalysis.country, summary: aiAnalysis.summary }
        })

        const locations = await Promise.all(
          aiAnalysis.locations.map(async (location) => {
            const locationRecord = await this.prisma.location.create({
              data: {
                videoId: video.id,
                originalName: location.name,
                type: location.type.toUpperCase() as LocationType,
                context: location.context,
                aiAddress: location.address,
                searchStatus: SearchStatus.PENDING
              }
            })

            const googlePlace = await this.googleMapsService.searchPlace(
              location.address as string,
              aiAnalysis.city,
              aiAnalysis.country
            )

            if ('error' in googlePlace) {
              await this.prisma.location.update({
                where: { id: locationRecord.id },
                data: { searchStatus: SearchStatus.NOT_FOUND }
              })
            } else {
              await this.prisma.location.update({
                where: { id: locationRecord.id },
                data: {
                  googleName: googlePlace.name,
                  formattedAddress: googlePlace.formatted_address,
                  latitude: googlePlace.location.lat,
                  longitude: googlePlace.location.lng,
                  placeId: googlePlace.place_id,
                  rating: googlePlace.rating,
                  googleMapsUrl: googlePlace.google_maps_url,
                  types: googlePlace.types,
                  searchStatus: SearchStatus.FOUND
                }
              })
            }

            return {
              id: locationRecord.id,
              original_name: location.name,
              type: location.type,
              context: location.context,
              google_place: googlePlace
            }
          })
        )

        const processingTime = Date.now() - startTime

        await this.prisma.video.update({
          where: { id: video.id },
          data: { status: VideoStatus.COMPLETED, processingTimeMs: processingTime }
        })

        return {
          success: true,
          video_id: video.id,
          video_info: { filename, size, mimetype, city: aiAnalysis.city, country: aiAnalysis.country },
          locations_found: locations.length,
          locations,
          processing_time_ms: processingTime
        }
      } catch (error) {
        await this.prisma.video.update({
          where: { id: video.id },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          data: { status: VideoStatus.FAILED, errorMessage: error.message }
        })
        
        this.logger.error(`Video analysis failed for video ${video.id}:`, error)
        throw new InternalServerErrorException(ERROR_MESSAGES.VIDEO.ANALYSIS_FAILED)
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error
      }
      this.logger.error('Unexpected error in video analysis:', error)
      throw new InternalServerErrorException(ERROR_MESSAGES.VIDEO.PROCESSING_FAILED)
    }
  }

  async getUserVideos(userId: string, skip = 0, take = 10) {
    if (!userId) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ID_REQUIRED)
    }

    if (skip < 0 || take < 0 || take > 50) {
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.INVALID_PAGINATION)
    }

    try {
      const [videos, total] = await Promise.all([
        this.prisma.video.findMany({
          where: { userId },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { locations: true }
        }),
        this.prisma.video.count({ where: { userId } })
      ])

      return { data: videos, total, page: Math.floor(skip / take) + 1, pageSize: take }
    } catch (error) {
      this.logger.error(`Failed to get videos for user ${userId}:`, error)
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.FAILED_FETCH_USER_VIDEOS)
    }
  }

  async getVideoById(userId: string, videoId: string) {
    if (!userId || !videoId) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        include: { locations: true }
      })

      if (!video) throw new NotFoundException(ERROR_MESSAGES.VIDEO.NOT_FOUND)
      if (video.userId !== userId) throw new ForbiddenException(ERROR_MESSAGES.AUTH.ACCESS_DENIED)

      return video
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      this.logger.error(`Failed to get video ${videoId} for user ${userId}:`, error)
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.FAILED_FETCH_VIDEO)
    }
  }

  async deleteVideo(userId: string, videoId: string) {
    if (!userId || !videoId) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      const video = await this.prisma.video.findUnique({ where: { id: videoId } })
      if (!video) throw new NotFoundException(ERROR_MESSAGES.VIDEO.NOT_FOUND)
      if (video.userId !== userId) throw new ForbiddenException(ERROR_MESSAGES.AUTH.ACCESS_DENIED)

      await this.prisma.video.delete({ where: { id: videoId } })
      return { message: 'Video deleted successfully' }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      this.logger.error(`Failed to delete video ${videoId} for user ${userId}:`, error)
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.FAILED_DELETE)
    }
  }

  async getUserStatistics(userId: string) {
    if (!userId) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ID_REQUIRED)
    }

    try {
      const [totalVideos, totalLocations, avgProcessingTime] = await Promise.all([
        this.prisma.video.count({ where: { userId } }),
        this.prisma.location.count({ where: { video: { userId } } }),
        this.prisma.video.aggregate({
          where: { userId, status: VideoStatus.COMPLETED },
          _avg: { processingTimeMs: true }
        })
      ])

      return {
        total_videos: totalVideos,
        total_locations: totalLocations,
        avg_processing_time_ms: avgProcessingTime._avg.processingTimeMs
      }
    } catch (error) {
      this.logger.error(`Failed to get statistics for user ${userId}:`, error)
      throw new BadRequestException(ERROR_MESSAGES.VIDEO.FAILED_FETCH_STATISTICS)
    }
  }
}
