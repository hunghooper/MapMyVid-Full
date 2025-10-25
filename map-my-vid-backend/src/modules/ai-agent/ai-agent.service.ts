import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../../database/prisma.service.js'

export interface RoutePreferences {
  maxDistance?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  transportation?: 'walking' | 'driving' | 'public_transport';
  duration?: number; // hours
}

export interface HotelRecommendation {
  name: string;
  price: string;
  rating: string;
  distance: string;
  address: string;
  bookingUrl: string;
}

export interface RouteItem {
  order: number;
  locationId: string;
  name: string;
  estimatedDuration: string;
  transportation: string;
  notes: string;
  hotelRecommendations?: HotelRecommendation[];
  location?: {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    googleMapsUrl: string;
    formattedAddress: string;
  };
}

export interface RouteSummary {
  totalDuration: string;
  totalDistance: string;
  transportationMode: string;
  bestTimeToStart: string;
  isOvernightTrip?: boolean;
  totalEstimatedCost?: string;
}

export interface RouteResponse {
  route: RouteItem[];
  summary: RouteSummary;
  recommendations: string[];
}

@Injectable()
export class AiAgentService {
  private genAI: GoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async generateOptimalRoute(userId: string, preferences?: RoutePreferences): Promise<RouteResponse> {
    // Lấy danh sách favorite locations của user
    const favoriteLocations = await this.prisma.location.findMany({
      where: {
        isFavorite: true,
        video: {
          userId,
        },
      },
      include: {
        video: true,
      },
    });

    if (favoriteLocations.length === 0) {
      throw new Error('No favorite locations found');
    }

    // Chuẩn bị dữ liệu cho AI
    const locationsData = favoriteLocations.map(loc => ({
      name: loc.originalName,
      type: loc.type,
      context: loc.context,
      latitude: loc.latitude,
      longitude: loc.longitude,
      googleName: loc.googleName,
      formattedAddress: loc.formattedAddress,
      googleMapsUrl: loc.googleMapsUrl,
    }));

    const prompt = this.buildRoutePrompt(locationsData, preferences);

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash'
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseRouteResponse(text, favoriteLocations);
    } catch (error) {
      console.error('AI Agent error:', error);
      throw new Error('Failed to generate optimal route');
    }
  }

  async generateOptimalRouteWithAudio(userId: string, audioBuffer: Buffer, audioMimeType: string): Promise<RouteResponse & { audioUrl?: string }> {
    // Lấy danh sách favorite locations của user
    const favoriteLocations = await this.prisma.location.findMany({
      where: {
        isFavorite: true,
        video: {
          userId,
        },
      },
      include: {
        video: true,
      },
    });

    if (favoriteLocations.length === 0) {
      throw new Error('No favorite locations found');
    }

    // Chuẩn bị dữ liệu cho AI
    const locationsData = favoriteLocations.map(loc => ({
      name: loc.originalName,
      type: loc.type,
      context: loc.context,
      latitude: loc.latitude,
      longitude: loc.longitude,
      googleName: loc.googleName,
      formattedAddress: loc.formattedAddress,
      googleMapsUrl: loc.googleMapsUrl,
    }));

    const prompt = this.buildAudioRoutePrompt(locationsData);

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-native-audio-preview-09-2025'
      });
      
      // Prepare content with audio input
      const content = [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: audioMimeType,
            data: audioBuffer.toString('base64')
          }
        }
      ];

      const result = await model.generateContent(content);
      const response = await result.response;
      
      // Extract text from response
      const text = response.text();
      
      const routeResponse = this.parseRouteResponse(text, favoriteLocations);
      
      // TODO: Implement audio extraction when API supports it
      // For now, return without audio URL
      return {
        ...routeResponse,
        audioUrl: undefined
      };
    } catch (error) {
      console.error('AI Audio Agent error:', error);
      throw new Error('Failed to generate optimal route with audio');
    }
  }

  private buildRoutePrompt(locations: any[], preferences?: RoutePreferences): string {
    const duration = preferences?.duration || 8;
    const isOvernightTrip = duration > 12 || (preferences?.timeOfDay === 'evening' && duration > 6);
    
    return `
Bạn là một AI Agent chuyên về lập kế hoạch du lịch thông minh. Dựa trên danh sách các địa điểm yêu thích của người dùng, hãy tạo một lộ trình tối ưu.

DANH SÁCH ĐỊA ĐIỂM YÊU THÍCH:
${locations.map((loc, index) => `
${index + 1}. ${loc.name} (${loc.type})
   - Địa chỉ: ${loc.formattedAddress}
   - Tọa độ: ${loc.latitude}, ${loc.longitude}
   - Ngữ cảnh: ${loc.context}
`).join('')}

THÔNG TIN CHUYẾN ĐI:
- Thời gian: ${preferences?.timeOfDay || 'morning'}
- Thời lượng: ${duration} giờ
- Phương tiện: ${preferences?.transportation || 'walking'}
- Khoảng cách tối đa: ${preferences?.maxDistance || 20} km
- Chuyến đi qua đêm: ${isOvernightTrip ? 'CÓ' : 'KHÔNG'}

Hãy tạo lộ trình tối ưu với:
1. Thứ tự tham quan hợp lý (tính toán khoảng cách và thời gian di chuyển)
2. Gợi ý thời gian dừng chân tại mỗi địa điểm
3. Gợi ý phương tiện di chuyển giữa các điểm
4. Ước tính tổng thời gian và khoảng cách
5. Lưu ý đặc biệt cho từng địa điểm
${isOvernightTrip ? '6. Tìm kiếm và đề xuất khách sạn gần các địa điểm yêu thích với giá cả, đánh giá và vị trí' : ''}

${isOvernightTrip ? `
QUAN TRỌNG: Vì đây là chuyến đi qua đêm, hãy tìm kiếm thông tin khách sạn:
- Tìm kiếm "hotels near [địa điểm] [thành phố]" trên Google
- Tìm 2-3 khách sạn gần các địa điểm yêu thích nhất
- Bao gồm giá phòng, đánh giá (sao), và khoảng cách đến địa điểm
- Ưu tiên khách sạn có giá hợp lý và đánh giá tốt
- Tích hợp thông tin khách sạn vào route items
- Sử dụng thông tin thực tế từ kết quả tìm kiếm Google
` : ''}

Trả về kết quả dưới dạng JSON với format:
{
  "route": [
    {
      "order": 1,
      "locationId": "location_id",
      "name": "Tên địa điểm",
      "estimatedDuration": "30-45 phút",
      "transportation": "Đi bộ/Ô tô/Xe máy",
      "notes": "Ghi chú đặc biệt"${isOvernightTrip ? `,
      "hotelRecommendations": [
        {
          "name": "Tên khách sạn",
          "price": "100-150 USD/đêm",
          "rating": "4.5/5",
          "distance": "0.5 km từ địa điểm",
          "address": "Địa chỉ khách sạn",
          "bookingUrl": "Link đặt phòng"
        }
      ]` : ''}
    }
  ],
  "summary": {
    "totalDuration": "4-5 giờ",
    "totalDistance": "8-10 km",
    "transportationMode": "Chủ yếu đi bộ",
    "bestTimeToStart": "8:00 AM"${isOvernightTrip ? `,
    "isOvernightTrip": true,
    "totalEstimatedCost": "200-300 USD"` : ''}
  },
  "recommendations": [
    "Gợi ý 1",
    "Gợi ý 2"
  ]
}
`;
  }

  private buildAudioRoutePrompt(locations: any[]): string {
    return `
Bạn là một AI Agent chuyên về lập kế hoạch du lịch thông minh. Người dùng sẽ nói cho bạn biết sở thích và yêu cầu của họ qua giọng nói. Dựa trên danh sách các địa điểm yêu thích của người dùng, hãy tạo một lộ trình tối ưu.

DANH SÁCH ĐỊA ĐIỂM YÊU THÍCH:
${locations.map((loc, index) => `
${index + 1}. ${loc.name} (${loc.type})
   - Địa chỉ: ${loc.formattedAddress}
   - Tọa độ: ${loc.latitude}, ${loc.longitude}
   - Ngữ cảnh: ${loc.context}
`).join('')}

Hãy lắng nghe yêu cầu của người dùng và tạo lộ trình tối ưu với:
1. Thứ tự tham quan hợp lý (tính toán khoảng cách và thời gian di chuyển)
2. Gợi ý thời gian dừng chân tại mỗi địa điểm
3. Gợi ý phương tiện di chuyển giữa các điểm
4. Ước tính tổng thời gian và khoảng cách
5. Lưu ý đặc biệt cho từng địa điểm
6. Nếu người dùng đề cập đến chuyến đi qua đêm hoặc cần nghỉ ngơi, hãy sử dụng Google Search để tìm kiếm thông tin khách sạn gần các địa điểm yêu thích

QUAN TRỌNG: Khi người dùng đề cập đến chuyến đi qua đêm, hãy tìm kiếm thông tin khách sạn:
- Tìm kiếm "hotels near [địa điểm] [thành phố]" trên Google
- Tìm 2-3 khách sạn gần các địa điểm yêu thích nhất
- Bao gồm giá phòng, đánh giá (sao), và khoảng cách đến địa điểm
- Ưu tiên khách sạn có giá hợp lý và đánh giá tốt
- Tích hợp thông tin khách sạn vào route items
- Sử dụng thông tin thực tế từ kết quả tìm kiếm Google

Trả về kết quả dưới dạng JSON với format:
{
  "route": [
    {
      "order": 1,
      "locationId": "location_id",
      "name": "Tên địa điểm",
      "estimatedDuration": "30-45 phút",
      "transportation": "Đi bộ/Ô tô/Xe máy",
      "notes": "Ghi chú đặc biệt",
      "hotelRecommendations": [
        {
          "name": "Tên khách sạn",
          "price": "100-150 USD/đêm",
          "rating": "4.5/5",
          "distance": "0.5 km từ địa điểm",
          "address": "Địa chỉ khách sạn",
          "bookingUrl": "Link đặt phòng"
        }
      ]
    }
  ],
  "summary": {
    "totalDuration": "4-5 giờ",
    "totalDistance": "8-10 km",
    "transportationMode": "Chủ yếu đi bộ",
    "bestTimeToStart": "8:00 AM",
    "isOvernightTrip": true,
    "totalEstimatedCost": "200-300 USD"
  },
  "recommendations": [
    "Gợi ý 1",
    "Gợi ý 2"
  ]
}

Hãy trả lời bằng cả văn bản và giọng nói để hướng dẫn người dùng một cách chi tiết và thân thiện.
`;
  }

  private parseRouteResponse(text: string, locations: any[]): RouteResponse {
    try {
      // Tìm JSON trong response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const routeData = JSON.parse(jsonMatch[0]);
      
      // Map locationId với actual location data
      const enrichedRoute = routeData.route.map(routeItem => {
        const location = locations.find(loc => 
          loc.originalName === routeItem.name || 
          loc.googleName === routeItem.name
        );
        
        return {
          ...routeItem,
          locationId: location?.id || '',
          location: location ? {
            id: location.id,
            name: location.originalName,
            type: location.type,
            latitude: location.latitude,
            longitude: location.longitude,
            googleMapsUrl: location.googleMapsUrl,
            formattedAddress: location.formattedAddress,
          } : null,
        };
      });

      return {
        ...routeData,
        route: enrichedRoute,
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI route response');
    }
  }
}
