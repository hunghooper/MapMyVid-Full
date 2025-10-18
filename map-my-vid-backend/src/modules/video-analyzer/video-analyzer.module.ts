import { Module } from '@nestjs/common'
import { VideoAnalyzerController } from './video-analyzer.controller.js'
import { VideoAnalyzerService } from './video-analyzer.service.js'
import { GeminiService } from './services/gemini.service.js'
import { GoogleMapsService } from './services/google-maps.service.js'
import { S3Service } from '../../common/utils/s3.service.js'

@Module({
  controllers: [VideoAnalyzerController],
  providers: [VideoAnalyzerService, GeminiService, GoogleMapsService, S3Service]
})
export class VideoAnalyzerModule {}
