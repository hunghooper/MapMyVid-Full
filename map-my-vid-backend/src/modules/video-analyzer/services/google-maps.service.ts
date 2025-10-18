/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { GooglePlaceDto } from '../dto/video-analysis.dto.js'

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name)
  private readonly apiKey: string
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place'
  private readonly requestTimeoutMs = 8000

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not set')
    }
    this.apiKey = apiKey
  }

  async searchPlace(
    locationName: string,
    city?: string,
    country?: string
  ): Promise<GooglePlaceDto | { error: string }> {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    const candidates = new Set<string>()
    const base = (t: string) => t.trim()
    const viCountry = country || 'Vietnam'

    candidates.add(base(locationName))
    if (city) candidates.add(base(`${locationName}, ${city}`))
    candidates.add(base(`${locationName}, ${city ?? ''}, ${viCountry}`))
    candidates.add(base(normalize(locationName)))
    if (city) candidates.add(base(normalize(`${locationName}, ${city}`)))
    candidates.add(base(normalize(`${locationName}, ${city ?? ''}, ${viCountry}`)))

    // Some helpful Vietnamese keywords to disambiguate points of interest
    const hintKeywords = ['quán', 'cửa hàng', 'tiệm', 'nhà hàng', 'quán ăn']
    for (const kw of hintKeywords) {
      candidates.add(base(`${locationName} ${kw}, ${city ?? ''} ${viCountry}`))
    }

    const queries = Array.from(candidates).filter((q) => q.length > 0)

    // Try Text Search first, then Find Place as fallback, across query variants
    for (const query of queries) {
      try {
        this.logger.log(`Searching Google Maps (textsearch): ${query}`)
        const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
          params: { query, key: this.apiKey, language: 'vi', region: 'vn' },
          timeout: this.requestTimeoutMs
        })
        const data = response.data
        if (data.status === 'OK' && data.results.length > 0) {
          const place = data.results[0]
          return {
            name: place.name,
            formatted_address: place.formatted_address,
            location: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
            place_id: place.place_id,
            rating: place.rating,
            types: place.types || [],
            google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          }
        }
      } catch (err) {
        this.logger.warn(`textsearch failed for "${query}": ${err.message}`)
      }

      try {
        this.logger.log(`Searching Google Maps (findplace): ${query}`)
        const response = await axios.get(`${this.baseUrl}/findplacefromtext/json`, {
          params: {
            input: query,
            inputtype: 'textquery',
            fields: 'place_id,name,formatted_address,geometry,types,rating',
            key: this.apiKey,
            language: 'vi'
          },
          timeout: this.requestTimeoutMs
        })
        const data = response.data
        if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
          const place = data.candidates[0]
          return {
            name: place.name,
            formatted_address: place.formatted_address,
            location: { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
            place_id: place.place_id,
            rating: place.rating,
            types: place.types || [],
            google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          }
        }
      } catch (err) {
        this.logger.warn(`findplace failed for "${query}": ${err.message}`)
      }
    }

    return { error: `Không tìm thấy địa điểm: ${locationName}` }
  }
}
