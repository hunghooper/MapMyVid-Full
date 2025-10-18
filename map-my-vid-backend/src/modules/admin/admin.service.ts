import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service.js'
import { ERROR_MESSAGES } from '../../common/constants/error-messages.js'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listUsers(params?: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = params ?? {}
    
    if (skip < 0 || take < 0 || take > 100) {
      throw new BadRequestException(ERROR_MESSAGES.ADMIN.INVALID_PAGINATION)
    }

    try {
      return await this.prisma.user.findMany({ 
        orderBy: { createdAt: 'desc' }, 
        skip, 
        take,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.ADMIN.FAILED_FETCH_USERS)
    }
  }

  async updateUserRole(userId: string, role: UserRole) {
    if (!userId || !role) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ROLE_REQUIRED)
    }

    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(ERROR_MESSAGES.USER.INVALID_ROLE)
    }

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND)
      }

      return await this.prisma.user.update({ 
        where: { id: userId }, 
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_UPDATE_ROLE)
    }
  }

  async setUserActive(userId: string, isActive: boolean) {
    if (!userId || typeof isActive !== 'boolean') {
      throw new BadRequestException(ERROR_MESSAGES.USER.ACTIVE_STATUS_REQUIRED)
    }

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND)
      }

      return await this.prisma.user.update({ 
        where: { id: userId }, 
        data: { isActive },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          updatedAt: true
        }
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_UPDATE_STATUS)
    }
  }

  async getSystemStats() {
    try {
      const [users, videos, locations] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.video.count(),
        this.prisma.location.count()
      ])
      return { users, videos, locations }
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.ADMIN.FAILED_FETCH_STATISTICS)
    }
  }

  async deleteUser(userId: string) {
    if (!userId) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ID_REQUIRED)
    }

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND)
      }

      // Check if user has videos or other data that should be handled
      const userVideos = await this.prisma.video.count({ where: { userId } })
      if (userVideos > 0) {
        throw new ForbiddenException(ERROR_MESSAGES.USER.CANNOT_DELETE_WITH_VIDEOS)
      }

      return await this.prisma.user.delete({ 
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      })
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_DELETE)
    }
  }
}

