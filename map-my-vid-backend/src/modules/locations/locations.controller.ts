import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LocationsService } from './locations.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { CurrentUser } from '../../common/decorators/current-user.decorator.js'
import { CreateLocationDto, UpdateLocationDto, LocationResponseDto, LocationListResponseDto, SetFavoriteDto } from './dto/location.dto.js'

@ApiTags('locations')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully', type: LocationResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@CurrentUser() user: any, @Body() createLocationDto: CreateLocationDto) {
    const { videoId, ...locationData } = createLocationDto
    return this.locationsService.create({
      ...locationData,
      video: { connect: { id: videoId } }
    })
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully', type: LocationListResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('videoId') videoId?: string,
    @Query('favoritesOnly') favoritesOnly = 'false'
  ) {
    const pageNumber = parseInt(page) || 1
    const take = parseInt(pageSize) || 20
    const skip = (pageNumber - 1) * take
    const isFavoritesOnly = favoritesOnly === 'true'
    return this.locationsService.findAllByUser(user.userId, { 
      skip, 
      take, 
      videoId,
      favoritesOnly: isFavoritesOnly 
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully', type: LocationResponseDto })
  @ApiResponse({ status: 404, description: 'Location not found' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.locationsService.findOneByUser(user.userId, id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update location' })
  @ApiResponse({ status: 200, description: 'Location updated successfully', type: LocationResponseDto })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.updateByUser(user.userId, id, updateLocationDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.locationsService.removeByUser(user.userId, id)
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get all favorite locations for user' })
  @ApiResponse({ status: 200, description: 'Favorite locations retrieved successfully', type: LocationListResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  getFavorites(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('videoId') videoId?: string
  ) {
    const pageNumber = parseInt(page) || 1
    const take = parseInt(pageSize) || 20
    const skip = (pageNumber - 1) * take
    return this.locationsService.findAllByUser(user.userId, { 
      skip, 
      take, 
      videoId,
      favoritesOnly: true 
    })
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status of location' })
  @ApiResponse({ status: 200, description: 'Favorite status toggled successfully', type: LocationResponseDto })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  toggleFavorite(@CurrentUser() user: any, @Param('id') id: string) {
    return this.locationsService.toggleFavorite(user.userId, id)
  }

  @Patch(':id/favorite/set')
  @ApiOperation({ summary: 'Set favorite status of location directly' })
  @ApiResponse({ status: 200, description: 'Favorite status set successfully', type: LocationResponseDto })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  setFavorite(
    @CurrentUser() user: any, 
    @Param('id') id: string, 
    @Body() setFavoriteDto: SetFavoriteDto
  ) {
    return this.locationsService.setFavorite(user.userId, id, setFavoriteDto.isFavorite)
  }
}

