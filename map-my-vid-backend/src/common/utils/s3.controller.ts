import { Controller, Get, Post, Delete, Param, Query, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { S3Service } from './s3.service.js';
import { ERROR_MESSAGES } from '../constants/error-messages.js';

@Controller('s3')
@UseGuards(JwtAuthGuard)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('health')
  async healthCheck() {
    return await this.s3Service.healthCheck();
  }

  @Get('list')
  async listObjects(
    @Query('prefix') prefix?: string,
    @Query('maxKeys') maxKeys?: number
  ) {
    if (maxKeys && (maxKeys < 1 || maxKeys > 1000)) {
      throw new BadRequestException('maxKeys must be between 1 and 1000');
    }
    
    return await this.s3Service.listObjects(prefix, maxKeys);
  }

  @Get('metadata/:key')
  async getObjectMetadata(@Param('key') key: string) {
    return await this.s3Service.getObjectMetadata(key);
  }

  @Get('exists/:key')
  async objectExists(@Param('key') key: string) {
    const exists = await this.s3Service.objectExists(key);
    return { key, exists };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('key') key?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileKey = key || `uploads/${Date.now()}-${file.originalname}`;
    
    return await this.s3Service.uploadBuffer(
      fileKey,
      file.buffer,
      file.mimetype
    );
  }

  @Delete(':key')
  async deleteObject(@Param('key') key: string) {
    await this.s3Service.deleteObject(key);
    return { message: 'Object deleted successfully', key };
  }
}
