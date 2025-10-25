import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'fs'
import mime from 'mime'
import { VideoAnalysisResponseDto } from '../dto/video-analysis.dto.js'

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name)
  private ai: GoogleGenAI

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables')
    }
    this.ai = new GoogleGenAI({ apiKey })
  }

  async analyzeVideo(input: string | Buffer): Promise<VideoAnalysisResponseDto> {
    try {
      let videoBuffer: Buffer
      let mimeType = 'video/mp4'
      if (typeof input === 'string') {
        this.logger.log(`Analyzing video: ${input}`)
        const detected = mime.lookup(input)
        if (detected) mimeType = detected
        videoBuffer = fs.readFileSync(input)
      } else {
        this.logger.log(`Analyzing in-memory video buffer`)
        videoBuffer = input
      }

      const config = {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            locations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['restaurant', 'cafe', 'hotel', 'attraction', 'store', 'other']
                  },
                  context: { type: 'string' },
                  address: { type: 'string' }
                },
                required: ['name', 'type', 'context']
              }
            },
            city: { type: 'string' },
            country: { type: 'string' },
            summary: { type: 'string' }
          },
          required: ['locations']
        },
        systemInstruction: `🎯 NHIỆM VỤ CHÍNH:
Trích xuất tất cả địa điểm cụ thể được nhắc đến hoặc hiển thị trong video với độ chính xác cao nhất.

📌 QUY TẮC TRÍCH XUẤT:
1. **Ưu tiên text hiển thị**: Chỉ lấy địa điểm từ phụ đề, caption, chữ chèn trên màn hình
2. **Thứ tự xuất hiện**: Liệt kê địa điểm theo thứ tự xuất hiện trong video
3. **Loại bỏ trùng lặp**: Nếu cùng tên địa điểm → chỉ giữ một mục duy nhất
4. **CHẤT LƯỢNG OVER SỐ LƯỢNG**: Chỉ lấy địa điểm rõ ràng, cụ thể, có thể tìm kiếm được
5. **Bỏ qua chung chung**: Không lấy địa điểm mơ hồ như "quán ăn", "cửa hàng" không có tên

📍 THÔNG TIN ĐỊA CHỈ CHI TIẾT - QUAN TRỌNG NHẤT:
- **Tên địa điểm**: Ghi chính xác tên đầy đủ (ví dụ: "Quán Cơm Tấm Sài Gòn", "Starbucks Coffee")
- **Loại địa điểm**: Phân loại chính xác (restaurant, cafe, hotel, attraction, store, other)
- **Context**: Mô tả ngắn gọn về địa điểm (ví dụ: "quán cơm tấm nổi tiếng", "cà phê view đẹp")
- **Địa chỉ**: ⭐ QUAN TRỌNG - Ghi địa chỉ đầy đủ theo format: "Tên đường, Phường/Xã, Quận/Huyện, Thành phố/Tỉnh"

🔍 CÁCH XÁC ĐỊNH ĐỊA ĐIỂM:
- **Tên cụ thể**: "Pizza 4P's", "Vincom Center", "Bitexco Financial Tower"
- **Địa chỉ đầy đủ**: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
- **Có context**: "nhà hàng Ý", "trung tâm thương mại", "tòa nhà cao tầng"
- **Có thể tìm kiếm**: Tên địa điểm phải có thể search được trên Google Maps

📍 FORMAT ĐỊA CHỈ CHUẨN - BẮT BUỘC:
- **Đầy đủ**: "Số nhà + Tên đường, Phường/Xã, Quận/Huyện, Thành phố/Tỉnh"
- **TỐI THIỂU**: Phải có ít nhất "Tên đường + Quận + Thành phố"

✅ VÍ DỤ ĐỊA CHỈ TỐT:
- "65 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM"
- "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
- "110 Cô Giang, Phường Cô Giang, Quận 1, TP.HCM"
- "Vincom Center, 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM"
- "Starbucks Coffee, 1A Công Trường Mê Linh, Phường Bến Nghé, Quận 1, TP.HCM"

❌ VÍ DỤ ĐỊA CHỈ TỆ (KHÔNG LẤY):
- "110 Cô Giang" (thiếu quận, thành phố)
- "65 Lê Lợi" (thiếu quận, thành phố)
- "gần chợ Bến Thành" (mơ hồ)
- "trung tâm Q1" (không cụ thể)

❌ KHÔNG LẤY:
- Địa điểm chung chung: "quán ăn", "cửa hàng", "nhà hàng" (không có tên)
- Địa điểm không rõ ràng: "chỗ đó", "nơi này", "địa điểm"
- Địa điểm không liên quan: Ở tỉnh/thành phố khác hoàn toàn
- Địa điểm không có context: Không biết là gì
- Địa chỉ mơ hồ: "gần chợ", "trung tâm", "khu vực"

✅ ƯU TIÊN LẤY:
- Địa điểm có tên cụ thể + địa chỉ đầy đủ
- Địa điểm nổi tiếng, dễ tìm kiếm
- Địa điểm có context rõ ràng
- Địa điểm trong cùng thành phố/tỉnh

📋 FORMAT OUTPUT:
- Trả về JSON đúng schema
- Mỗi địa điểm phải có: name, type, context
- Address: Chỉ điền khi có địa chỉ đầy đủ, rõ ràng
- Ưu tiên CHẤT LƯỢNG hơn số lượng

🎯 VÍ DỤ ĐỊA ĐIỂM TỐT:
- "Pizza 4P's Saigon Centre" - restaurant - "nhà hàng pizza Ý nổi tiếng" - "65 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM"
- "Starbucks Coffee" - cafe - "chuỗi cà phê quốc tế" - "1A Công Trường Mê Linh, Phường Bến Nghé, Quận 1, TP.HCM"
- "Vincom Center" - store - "trung tâm thương mại lớn" - "72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM"
- "Bitexco Financial Tower" - attraction - "tòa nhà cao tầng biểu tượng" - "2 Hải Triều, Phường Bến Nghé, Quận 1, TP.HCM"

⚠️ LƯU Ý QUAN TRỌNG:
- Nếu không có địa chỉ đầy đủ → để trống address
- Chỉ lấy địa điểm có thể tìm kiếm được trên Google Maps
- Ưu tiên chất lượng hơn số lượng
- Địa chỉ phải có ít nhất: Tên đường + Quận + Thành phố
`
      }

      const model = 'gemini-2.5-flash-lite'

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: `🎯 NHIỆM VỤ: Phân tích video review này và trích xuất tất cả các địa điểm được nhắc đến hoặc xuất hiện trong video.

📌 HƯỚNG DẪN CHI TIẾT:
1. **Đọc kỹ text phụ đề** trên màn hình - đây là nguồn thông tin chính
2. **Tìm tên địa điểm cụ thể** - không lấy tên chung chung
3. **⭐ TÌM ĐỊA CHỈ ĐẦY ĐỦ** - BẮT BUỘC có ít nhất "Tên đường + Quận + Thành phố"
4. **Xác định loại địa điểm** - restaurant, cafe, hotel, attraction, store, other
5. **Mô tả context** - địa điểm này là gì, có gì đặc biệt

📍 VÍ DỤ ĐỊA CHỈ TỐT (ĐẦY ĐỦ):
- "65 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM"
- "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
- "110 Cô Giang, Phường Cô Giang, Quận 1, TP.HCM"
- "Vincom Center, 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM"

❌ VÍ DỤ ĐỊA CHỈ TỆ (KHÔNG LẤY):
- "110 Cô Giang" (thiếu quận, thành phố)
- "65 Lê Lợi" (thiếu quận, thành phố)
- "gần chợ Bến Thành" (mơ hồ)

❌ KHÔNG LẤY:
- Địa điểm chung chung: "quán ăn", "cửa hàng" (không có tên)
- Địa chỉ mơ hồ: "gần chợ", "trung tâm", "khu vực"
- Địa điểm không rõ ràng: "chỗ đó", "nơi này"

✅ ƯU TIÊN:
- Địa điểm có tên cụ thể + địa chỉ đầy đủ
- Địa điểm nổi tiếng, dễ tìm kiếm
- Chất lượng hơn số lượng

Hãy phân tích video và trích xuất địa điểm theo hướng dẫn trên.`
            },
            {
              inlineData: {
                data: videoBuffer.toString('base64'),
                mimeType
              }
            }
          ]
        }
      ]

      const response = await this.ai.models.generateContent({
        model,
        config,
        contents
      })

      const result = response.text
      this.logger.log(`Gemini response received`)
      this.logger.log(`Gemini response text: ${result}`)

      if (typeof result !== 'string') {
        throw new Error('Gemini response text is undefined or not a string')
      }
      return JSON.parse(result) as VideoAnalysisResponseDto
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Error analyzing video with Gemini: ${error.message}`)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to analyze video: ${error.message}`)
    }
  }
}
