import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LocationsService } from './locations.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { CurrentUser } from '../../common/decorators/current-user.decorator.js'

@ApiTags('locations')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.locationsService.create({ ...body })
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20'
  ) {
    const pageNumber = parseInt(page) || 1
    const take = parseInt(pageSize) || 20
    const skip = (pageNumber - 1) * take
    return this.locationsService.findAllByUser(user.userId, { skip, take })
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.locationsService.findOneByUser(user.userId, id)
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.locationsService.updateByUser(user.userId, id, { ...body })
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.locationsService.removeByUser(user.userId, id)
  }
}

