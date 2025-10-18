/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { VideoAnalyzerService } from './video-analyzer.service.js'
import { CurrentUser } from '../../common/decorators/current-user.decorator.js'

@Controller('api/video-analyzer')
@UseGuards(JwtAuthGuard)
export class VideoAnalyzerController {
  constructor(private videoAnalyzerService: VideoAnalyzerService) {}

  @Post('analyze')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(new BadRequestException('Only video files allowed'), false)
        }
        cb(null, true)
      },
      limits: { fileSize: 100 * 1024 * 1024 } // 100MB
    })
  )
  async analyzeVideo(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No video file uploaded')
    return this.videoAnalyzerService.analyzeVideoAndFindLocations(
      user.userId,
      file.buffer,
      `video-${Date.now()}${path.extname(file.originalname)}`,
      file.originalname,
      file.size,
      file.mimetype
    )
  }

  @Get('videos')
  async getMyVideos(@CurrentUser() user: any, @Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    const pageNumber = parseInt(page) || 1
    const pageSizeNumber = parseInt(pageSize) || 10
    const skip = (pageNumber - 1) * pageSizeNumber
    return this.videoAnalyzerService.getUserVideos(user.userId, skip, pageSizeNumber)
  }

  @Get('videos/:id')
  async getVideoById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.videoAnalyzerService.getVideoById(user.userId, id)
  }

  @Delete('videos/:id')
  async deleteVideo(@CurrentUser() user: any, @Param('id') id: string) {
    return this.videoAnalyzerService.deleteVideo(user.userId, id)
  }

  @Get('statistics')
  async getMyStatistics(@CurrentUser() user: any) {
    return this.videoAnalyzerService.getUserStatistics(user.userId)
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      service: 'Video Location Analyzer API with Auth',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    }
  }
}
