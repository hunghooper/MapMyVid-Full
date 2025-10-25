import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module.js'
import { VideoAnalyzerModule } from './modules/video-analyzer/video-analyzer.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UsersModule } from './modules/users/users.module.js'
import { LocationsModule } from './modules/locations/locations.module.js'
import { AdminModule } from './modules/admin/admin.module.js'
import { AiAgentModule } from './modules/ai-agent/ai-agent.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    VideoAnalyzerModule,
    LocationsModule,
    AdminModule,
    AiAgentModule
  ]
}) 
export class AppModule {}
