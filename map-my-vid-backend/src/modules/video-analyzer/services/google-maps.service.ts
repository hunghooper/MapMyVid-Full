/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { GooglePlaceDto } from '../dto/video-analysis.dto.js'
import { ERROR_MESSAGES } from '../../../common/constants/error-messages.js'

interface SearchResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
  }
  rating?: number
  types?: string[]
  business_status?: string
  price_level?: number
  user_ratings_total?: number
  vicinity?: string
}

interface PlaceDetailsResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
  }
  rating?: number
  types?: string[]
  business_status?: string
  price_level?: number
  user_ratings_total?: number
  vicinity?: string
  website?: string
  international_phone_number?: string
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

interface SearchContext {
  city?: string
  country?: string
  locationBias?: { lat: number; lng: number; radius: number }
  type?: string
  priceLevel?: number
  minRating?: number
}

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name)
  private readonly apiKey: string
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place'
  private readonly geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode'
  private readonly requestTimeoutMs = 10000

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new BadRequestException('GOOGLE_MAPS_API_KEY is not set')
    }
    this.apiKey = apiKey
  }

  async searchPlace(
    locationName: string,
    address?: string,
    city?: string,
    country?: string
  ): Promise<GooglePlaceDto | { error: string }> {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    // Initial query generation (will be regenerated after address validation)

    this.logger.log(`Searching for: "${locationName}"`)
    if (address) {
      this.logger.log(`With address: "${address}"`)
      // Validate address format
      if (!this.isValidAddress(address)) {
        this.logger.warn(`⚠️ Address format is incomplete: "${address}" - will search by name only`)
        // If address is invalid, don't use it in search
        address = undefined
      } else {
        this.logger.log(`✅ Address format is valid - will use in search`)
      }
    }
    if (city) {
      this.logger.log(`In city: "${city}"`)
    }

    // Regenerate queries after address validation
    const finalCandidates = new Set<string>()
    const base = (t: string) => t.trim()
    const viCountry = country || 'Vietnam'

    // Strategy 1: Name only
    finalCandidates.add(base(locationName))
    finalCandidates.add(base(normalize(locationName)))

    // Strategy 2: Name + City
    if (city) {
      finalCandidates.add(base(`${locationName}, ${city}`))
      finalCandidates.add(base(normalize(`${locationName}, ${city}`)))
    }

    // Strategy 3: Name + City + Country
    finalCandidates.add(base(`${locationName}, ${city ?? ''}, ${viCountry}`))
    finalCandidates.add(base(normalize(`${locationName}, ${city ?? ''}, ${viCountry}`)))

    // Strategy 4: Name + Address (if valid)
    if (address) {
      finalCandidates.add(base(`${locationName}, ${address}`))
      finalCandidates.add(base(normalize(`${locationName}, ${address}`)))
      
      if (city) {
        finalCandidates.add(base(`${locationName}, ${address}, ${city}`))
        finalCandidates.add(base(normalize(`${locationName}, ${address}, ${city}`)))
      }
      
      finalCandidates.add(base(`${locationName}, ${address}, ${city ?? ''}, ${viCountry}`))
      finalCandidates.add(base(normalize(`${locationName}, ${address}, ${city ?? ''}, ${viCountry}`)))
    }

    // Strategy 5: Address only (if valid)
    if (address) {
      finalCandidates.add(base(address))
      finalCandidates.add(base(normalize(address)))
      
      if (city) {
        finalCandidates.add(base(`${address}, ${city}`))
        finalCandidates.add(base(normalize(`${address}, ${city}`)))
      }
    }

    // Strategy 6: Vietnamese keywords
    const hintKeywords = ['quán', 'cửa hàng', 'tiệm', 'nhà hàng', 'quán ăn', 'cà phê', 'coffee']
    for (const kw of hintKeywords) {
      finalCandidates.add(base(`${locationName} ${kw}, ${city ?? ''}, ${viCountry}`))
      if (address) {
        finalCandidates.add(base(`${locationName} ${kw}, ${address}, ${city ?? ''}, ${viCountry}`))
      }
    }

    const queries = Array.from(finalCandidates).filter((q) => q.length > 0)
    this.logger.log(`Generated ${queries.length} search queries`)

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

  private isValidAddress(address: string): boolean {
    if (!address || address.trim().length === 0) {
      return false
    }

    const addressLower = address.toLowerCase()
    
    // Check for complete address format: "Số nhà + Tên đường, Phường/Xã, Quận/Huyện, Thành phố/Tỉnh"
    const hasStreet = /đường|street|str\.|phố|pho/.test(addressLower)
    const hasDistrict = /quận|huyện|district|q\.|h\./.test(addressLower)
    const hasCity = /tp\.|thành phố|city|hcm|hà nội|đà nẵng|hải phòng|cần thơ/.test(addressLower)
    
    // At least need street + district + city for valid address
    const isValid = hasStreet && hasDistrict && hasCity
    
    if (!isValid) {
      this.logger.warn(`❌ Address validation failed for: "${address}"`)
      this.logger.warn(`- Has street: ${hasStreet}`)
      this.logger.warn(`- Has district: ${hasDistrict}`)
      this.logger.warn(`- Has city: ${hasCity}`)
      this.logger.warn(`- Required: Street + District + City`)
    } else {
      this.logger.log(`✅ Address validation passed for: "${address}"`)
    }
    
    return isValid
  }
}
