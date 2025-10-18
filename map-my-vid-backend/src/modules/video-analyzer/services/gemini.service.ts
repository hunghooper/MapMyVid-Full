import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'fs'
import { Mime } from 'mime'
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
      const mime = new Mime()
      let videoBuffer: Buffer
      let mimeType = 'video/mp4'
      if (typeof input === 'string') {
        this.logger.log(`Analyzing video: ${input}`)
        const detected = mime.getType(input)
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
        systemInstruction: `🎯 Nhiệm vụ:
Trích xuất tất cả địa điểm cụ thể được nhắc đến hoặc hiển thị dưới dạng **text hoặc phụ đề** trong video. Không phân tích hình ảnh hoặc biển hiệu.

📌 Yêu cầu chi tiết:
- Liệt kê các địa điểm đúng **thứ tự xuất hiện trong video**.
- Chỉ lấy địa điểm từ **text hiển thị** trên màn hình (phụ đề, caption, chữ chèn).
- **Bỏ qua các địa điểm trùng lặp** (nếu cùng tên thì chỉ giữ một mục duy nhất).
- Nếu không chắc chắn địa điểm có liên quan (ví dụ: ở tỉnh/thành phố khác hoàn toàn) → **không đưa vào danh sách**.
- Nếu địa điểm không rõ ràng hoặc chung chung, **bỏ qua**.

📍 Địa chỉ:
- Nếu video có hiển thị địa chỉ → ghi đầy đủ: **tên đường, phường/xã, thành phố/tỉnh**.
- Nếu không có địa chỉ cụ thể → ghi phần có thể xác định được, hoặc để trống.

Trả về kết quả dưới dạng một đối tượng JSON duy nhất, tuân thủ nghiêm ngặt đúng schema.

Trong mỗi address, hãy bao gồm tên đường và thành phố/tỉnh nếu xác định được.
`
      }

      const model = 'gemini-2.5-flash-lite'

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: 'Hãy phân tích video review này và trích xuất tất cả các địa điểm được nhắc đến hoặc xuất hiện trong video. Chú ý đọc kỹ text phụ đề trên màn hình.'
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
