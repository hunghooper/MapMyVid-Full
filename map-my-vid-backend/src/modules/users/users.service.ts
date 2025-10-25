/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../database/prisma.service.js'
import { ERROR_MESSAGES } from '../../common/constants/error-messages.js'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    if (!data.email || !data.password) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED)
    }

    try {
      return await this.prisma.user.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS)
        }
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_CREATE)
    }
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException(ERROR_MESSAGES.USER.EMAIL_REQUIRED)
    }

    try {
      return await this.prisma.user.findUnique({ where: { email } })
    } catch (error) {
      // Only throw error for actual database errors, not when user is not found
      console.error('Database error in findByEmail:', error)
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_FIND_BY_EMAIL)
    }
  }

  async findById(id: string) {
    if (!id) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ID_REQUIRED)
    }

    try {
      const user = await this.prisma.user.findUnique({ where: { id } })
      if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND)
      }
      return user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_FIND_BY_ID)
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    if (!id) {
      throw new BadRequestException(ERROR_MESSAGES.USER.ID_REQUIRED)
    }

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } })
      if (!existingUser) {
        throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND)
      }

      return await this.prisma.user.update({ where: { id }, data })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS)
        }
      }
      throw new BadRequestException(ERROR_MESSAGES.USER.FAILED_UPDATE)
    }
  }
}
