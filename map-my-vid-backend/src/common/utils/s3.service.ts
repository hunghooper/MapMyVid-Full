import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
          }
        : undefined
    })
    this.bucket = process.env.AWS_S3_BUCKET as string
    if (!this.bucket) throw new Error('AWS_S3_BUCKET is not set')
  }

  async uploadBuffer(key: string, body: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType })
    )
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  }
}

