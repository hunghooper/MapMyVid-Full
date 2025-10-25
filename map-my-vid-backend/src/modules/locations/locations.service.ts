import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service.js'
import { ERROR_MESSAGES } from '../../common/constants/error-messages.js'

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LocationCreateInput) {
    if (!data.video || !data.originalName) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.VIDEO_ID_REQUIRED)
    }

    try {
      return await this.prisma.location.create({ data })
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_CREATE)
    }
  }

  async findAllByUser(
    userId: string,
    params?: { skip?: number; take?: number; favoritesOnly?: boolean; videoId?: string }
  ) {
    if (!userId) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.USER_ID_REQUIRED)
    }

    const { skip = 0, take = 20, favoritesOnly = false, videoId } = params ?? {}

    if (skip < 0 || take < 0 || take > 100) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.INVALID_PAGINATION)
    }

    try {
      const where: Prisma.LocationWhereInput = {
        video: { userId }
      }

      if (favoritesOnly) {
        where.isFavorite = true
      }

      if (videoId) {
        where.videoId = videoId
      }

      const [locations, total] = await Promise.all([
        this.prisma.location.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        this.prisma.location.count({ where })
      ])

      return {
        data: locations,
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take
      }
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_FETCH)
    }
  }

  async findOneByUser(userId: string, id: string) {
    if (!userId || !id) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.LOCATION_ID_REQUIRED)
    }

    try {
      const location = await this.prisma.location.findFirst({
        where: { id, video: { userId } }
      })

      if (!location) {
        throw new NotFoundException(ERROR_MESSAGES.LOCATION.NOT_FOUND)
      }

      return location
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_FIND)
    }
  }

  async updateByUser(userId: string, id: string, data: Prisma.LocationUpdateInput) {
    if (!userId || !id) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.LOCATION_ID_REQUIRED)
    }

    try {
      const existingLocation = await this.prisma.location.findFirst({
        where: { id, video: { userId } }
      })

      if (!existingLocation) {
        throw new NotFoundException(ERROR_MESSAGES.LOCATION.NOT_FOUND)
      }

      return await this.prisma.location.update({
        where: { id },
        data
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_UPDATE)
    }
  }

  async removeByUser(userId: string, id: string) {
    if (!userId || !id) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.LOCATION_ID_REQUIRED)
    }

    try {
      const existing = await this.prisma.location.findFirst({
        where: { id, video: { userId } }
      })

      if (!existing) {
        throw new NotFoundException(ERROR_MESSAGES.LOCATION.NOT_FOUND)
      }

      return await this.prisma.location.delete({ where: { id } })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_DELETE)
    }
  }

  async toggleFavorite(userId: string, id: string) {
    if (!userId || !id) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.LOCATION_ID_REQUIRED)
    }

    try {
      const existing = await this.prisma.location.findFirst({
        where: { id, video: { userId } }
      })

      if (!existing) {
        throw new NotFoundException(ERROR_MESSAGES.LOCATION.NOT_FOUND)
      }

      return await this.prisma.location.update({
        where: { id },
        data: { isFavorite: !existing.isFavorite }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_TOGGLE_FAVORITE)
    }
  }

  async setFavorite(userId: string, id: string, isFavorite: boolean) {
    if (!userId || !id) {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.LOCATION_ID_REQUIRED)
    }

    if (typeof isFavorite !== 'boolean') {
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.INVALID_FAVORITE_STATUS)
    }

    try {
      const existing = await this.prisma.location.findFirst({
        where: { id, video: { userId } }
      })

      if (!existing) {
        throw new NotFoundException(ERROR_MESSAGES.LOCATION.NOT_FOUND)
      }

      return await this.prisma.location.update({
        where: { id },
        data: { isFavorite }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.LOCATION.FAILED_SET_FAVORITE)
    }
  }
}
