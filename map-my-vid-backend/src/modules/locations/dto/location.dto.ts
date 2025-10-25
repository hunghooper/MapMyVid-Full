import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsEnum } from 'class-validator'
import { LocationType, SearchStatus } from '@prisma/client'

export class CreateLocationDto {
  @ApiProperty({ description: 'Video ID' })
  @IsString()
  videoId: string

  @ApiProperty({ description: 'Original name of the location' })
  @IsString()
  originalName: string

  @ApiProperty({ description: 'Type of location', enum: LocationType })
  @IsEnum(['RESTAURANT', 'CAFE', 'HOTEL', 'ATTRACTION', 'STORE', 'OTHER'])
  type: LocationType

  @ApiProperty({ description: 'Context information' })
  @IsString()
  context: string

  @ApiProperty({ description: 'AI generated address', required: false })
  @IsOptional()
  @IsString()
  aiAddress?: string

  @ApiProperty({ description: 'Google place name', required: false })
  @IsOptional()
  @IsString()
  googleName?: string

  @ApiProperty({ description: 'Formatted address', required: false })
  @IsOptional()
  @IsString()
  formattedAddress?: string

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number

  @ApiProperty({ description: 'Google Place ID', required: false })
  @IsOptional()
  @IsString()
  placeId?: string

  @ApiProperty({ description: 'Rating', required: false })
  @IsOptional()
  @IsNumber()
  rating?: number

  @ApiProperty({ description: 'Google Maps URL', required: false })
  @IsOptional()
  @IsString()
  googleMapsUrl?: string

  @ApiProperty({ description: 'Place types', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[]

  @ApiProperty({ description: 'Search status', enum: SearchStatus, required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'FOUND', 'NOT_FOUND', 'ERROR'])
  searchStatus?: SearchStatus

  @ApiProperty({ description: 'Is favorite', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean
}

export class UpdateLocationDto {
  @ApiProperty({ description: 'Original name of the location', required: false })
  @IsOptional()
  @IsString()
  originalName?: string

  @ApiProperty({ description: 'Type of location', enum: LocationType, required: false })
  @IsOptional()
  @IsEnum(['RESTAURANT', 'CAFE', 'HOTEL', 'ATTRACTION', 'STORE', 'OTHER'])
  type?: LocationType

  @ApiProperty({ description: 'Context information', required: false })
  @IsOptional()
  @IsString()
  context?: string

  @ApiProperty({ description: 'AI generated address', required: false })
  @IsOptional()
  @IsString()
  aiAddress?: string

  @ApiProperty({ description: 'Google place name', required: false })
  @IsOptional()
  @IsString()
  googleName?: string

  @ApiProperty({ description: 'Formatted address', required: false })
  @IsOptional()
  @IsString()
  formattedAddress?: string

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number

  @ApiProperty({ description: 'Google Place ID', required: false })
  @IsOptional()
  @IsString()
  placeId?: string

  @ApiProperty({ description: 'Rating', required: false })
  @IsOptional()
  @IsNumber()
  rating?: number

  @ApiProperty({ description: 'Google Maps URL', required: false })
  @IsOptional()
  @IsString()
  googleMapsUrl?: string

  @ApiProperty({ description: 'Place types', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[]

  @ApiProperty({ description: 'Search status', enum: SearchStatus, required: false })
  @IsOptional()
  @IsEnum(['PENDING', 'FOUND', 'NOT_FOUND', 'ERROR'])
  searchStatus?: SearchStatus

  @ApiProperty({ description: 'Is favorite', required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean
}

export class LocationResponseDto {
  @ApiProperty({ description: 'Location ID' })
  id: string

  @ApiProperty({ description: 'Video ID' })
  videoId: string

  @ApiProperty({ description: 'Original name of the location' })
  originalName: string

  @ApiProperty({ description: 'Type of location', enum: LocationType })
  type: LocationType

  @ApiProperty({ description: 'Context information' })
  context: string

  @ApiProperty({ description: 'AI generated address', nullable: true })
  aiAddress: string | null

  @ApiProperty({ description: 'Google place name', nullable: true })
  googleName: string | null

  @ApiProperty({ description: 'Formatted address', nullable: true })
  formattedAddress: string | null

  @ApiProperty({ description: 'Latitude', nullable: true })
  latitude: number | null

  @ApiProperty({ description: 'Longitude', nullable: true })
  longitude: number | null

  @ApiProperty({ description: 'Google Place ID', nullable: true })
  placeId: string | null

  @ApiProperty({ description: 'Rating', nullable: true })
  rating: number | null

  @ApiProperty({ description: 'Google Maps URL', nullable: true })
  googleMapsUrl: string | null

  @ApiProperty({ description: 'Place types', type: [String] })
  types: string[]

  @ApiProperty({ description: 'Search status', enum: SearchStatus })
  searchStatus: SearchStatus

  @ApiProperty({ description: 'Is favorite' })
  isFavorite: boolean

  @ApiProperty({ description: 'Created at' })
  createdAt: Date

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date
}

export class SetFavoriteDto {
  @ApiProperty({ description: 'Favorite status', example: true })
  @IsBoolean()
  isFavorite: boolean
}

export class LocationListResponseDto {
  @ApiProperty({ description: 'List of locations', type: [LocationResponseDto] })
  data: LocationResponseDto[]

  @ApiProperty({ description: 'Total count' })
  total: number

  @ApiProperty({ description: 'Current page' })
  page: number

  @ApiProperty({ description: 'Page size' })
  pageSize: number
}
