import { Controller, Post, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { AiAgentService, RoutePreferences, RouteResponse } from './ai-agent.service.js';

@Controller('api/ai-agent')
@UseGuards(JwtAuthGuard)
export class AiAgentController {
  constructor(private aiAgentService: AiAgentService) {}

  @Post('generate-route')
  async generateOptimalRoute(
    @Request() req,
    @Body() body: {
      preferences?: RoutePreferences;
    }
  ): Promise<RouteResponse> {
    const userId = req.user.id;
    return this.aiAgentService.generateOptimalRoute(userId, body.preferences);
  }

  @Post('generate-route-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async generateOptimalRouteWithAudio(
    @Request() req,
    @UploadedFile() audio: Express.Multer.File
  ): Promise<RouteResponse & { audioUrl?: string }> {
    const userId = req.user.id;
    
    if (!audio) {
      throw new Error('Audio file is required');
    }

    // Validate audio file type
    const allowedMimeTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    if (!allowedMimeTypes.includes(audio.mimetype)) {
      throw new Error('Invalid audio file type. Supported formats: WebM, WAV, MP3');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audio.size > maxSize) {
      throw new Error('Audio file too large. Maximum size: 10MB');
    }

    return this.aiAgentService.generateOptimalRouteWithAudio(
      userId, 
      audio.buffer, 
      audio.mimetype
    );
  }
}
