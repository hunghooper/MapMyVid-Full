import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service.js'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('api/health')
  healthCheck() {
    return {
      status: 'OK',
      service: 'Map My Vid API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  }
}
