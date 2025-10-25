import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service.js';
import { AiAgentController } from './ai-agent.controller.js';
import { DatabaseModule } from '../../database/database.module.js';


@Module({
  imports: [DatabaseModule],
  providers: [AiAgentService],
  controllers: [AiAgentController],
  exports: [AiAgentService],
})
export class AiAgentModule {}
