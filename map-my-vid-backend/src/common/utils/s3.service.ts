import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand, 
  ListObjectsV2Command,
  HeadObjectCommand,
  S3ClientConfig
} from '@aws-sdk/client-s3'
import { ERROR_MESSAGES } from '../constants/error-messages.js'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly logger = new Logger(S3Service.name)

  constructor() {
    this.validateConfiguration()
    
    const config: S3ClientConfig = {
      region: process.env.AWS_REGION,
    }

    // Use IAM role if no credentials provided (for EC2/ECS/Lambda)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    }

    this.client = new S3Client(config)
    this.bucket = process.env.AWS_S3_BUCKET as string
    
    this.logger.log(`S3Service initialized with bucket: ${this.bucket}`)
  }

  private validateConfiguration(): void {
    const requiredEnvVars = ['AWS_REGION', 'AWS_S3_BUCKET']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      throw new BadRequestException(
        `Missing required environment variables: ${missingVars.join(', ')}`
      )
    }

    // Validate AWS credentials (either IAM role or access keys)
    const hasAccessKeys = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    const hasIAMRole = !process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_SECRET_ACCESS_KEY
    
    if (!hasAccessKeys && !hasIAMRole) {
      this.logger.warn('No AWS credentials provided. Using IAM role or default credential chain.')
    }
  }

  async uploadBuffer(key: string, body: Buffer, contentType: string): Promise<string> {
    if (!key || !body || !contentType) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    if (body.length === 0) {
      throw new BadRequestException('File content cannot be empty')
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (body.length > maxSize) {
      throw new BadRequestException(ERROR_MESSAGES.FILE.INVALID_SIZE)
    }

    try {
      this.logger.log(`Uploading file to S3: ${key} (${body.length} bytes)`)
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
        Metadata: {
          uploadedAt: new Date().toISOString(),
          originalSize: body.length.toString()
        }
      })

      await this.client.send(command)
      
      const url = this.generatePublicUrl(key)
      this.logger.log(`File uploaded successfully: ${url}`)
      
      return url
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${key}`, error)
      throw new InternalServerErrorException(ERROR_MESSAGES.FILE.UPLOAD_FAILED)
    }
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      this.logger.log(`Deleting file from S3: ${key}`)
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      })

      await this.client.send(command)
      this.logger.log(`File deleted successfully: ${key}`)
    } catch (error) {
      this.logger.error(`Failed to delete file from S3: ${key}`, error)
      throw new InternalServerErrorException('Failed to delete file from S3')
    }
  }

  async getObject(key: string): Promise<Buffer> {
    if (!key) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      this.logger.log(`Retrieving file from S3: ${key}`)
      
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      })

      const response = await this.client.send(command)
      
      if (!response.Body) {
        throw new Error('No file content received')
      }

      const chunks: Uint8Array[] = []
      const stream = response.Body as any
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      const buffer = Buffer.concat(chunks)
      this.logger.log(`File retrieved successfully: ${key} (${buffer.length} bytes)`)
      
      return buffer
    } catch (error) {
      this.logger.error(`Failed to retrieve file from S3: ${key}`, error)
      throw new InternalServerErrorException('Failed to retrieve file from S3')
    }
  }

  async listObjects(prefix?: string, maxKeys: number = 1000): Promise<any[]> {
    try {
      this.logger.log(`Listing objects in S3 bucket: ${this.bucket}${prefix ? ` with prefix: ${prefix}` : ''}`)
      
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys
      })

      const response = await this.client.send(command)
      const objects = response.Contents || []
      
      this.logger.log(`Found ${objects.length} objects in S3 bucket`)
      
      return objects.map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        etag: obj.ETag,
        url: this.generatePublicUrl(obj.Key!)
      }))
    } catch (error) {
      this.logger.error(`Failed to list objects in S3 bucket: ${this.bucket}`, error)
      throw new InternalServerErrorException('Failed to list objects in S3')
    }
  }

  async objectExists(key: string): Promise<boolean> {
    if (!key) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key
      })

      await this.client.send(command)
      return true
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false
      }
      this.logger.error(`Error checking if object exists: ${key}`, error)
      throw new InternalServerErrorException('Failed to check if object exists')
    }
  }

  async getObjectMetadata(key: string): Promise<any> {
    if (!key) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION.MISSING_PARAMETERS)
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key
      })

      const response = await this.client.send(command)
      
      return {
        key,
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        etag: response.ETag,
        metadata: response.Metadata,
        url: this.generatePublicUrl(key)
      }
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new BadRequestException('Object not found')
      }
      this.logger.error(`Failed to get object metadata: ${key}`, error)
      throw new InternalServerErrorException('Failed to get object metadata')
    }
  }

  private generatePublicUrl(key: string): string {
    const region = process.env.AWS_REGION
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; bucket: string; region: string }> {
    try {
      // Try to list objects to verify connection
      await this.listObjects('', 1)
      
      return {
        status: 'healthy',
        bucket: this.bucket,
        region: process.env.AWS_REGION || 'unknown'
      }
    } catch (error) {
      this.logger.error('S3 health check failed', error)
      throw new InternalServerErrorException('S3 service is not available')
    }
  }
}

