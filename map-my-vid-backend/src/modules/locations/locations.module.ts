import { Module } from '@nestjs/common'
import { LocationsService } from './locations.service.js'
import { LocationsController } from './locations.controller.js'

@Module({
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService]
})
export class LocationsModule {}

