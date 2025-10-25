import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../src/common/utils/s3.service.js';

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    // Mock environment variables
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_S3_BUCKET 
    process.env.AWS_ACCESS_KEY_ID
    process.env.AWS_SECRET_ACCESS_KEY

    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate configuration', () => {
    expect(() => {
      new S3Service();
    }).not.toThrow();
  });

  it('should throw error for missing bucket', () => {
    delete process.env.AWS_S3_BUCKET;
    
    expect(() => {
      new S3Service();
    }).toThrow();
  });

  it('should throw error for missing region', () => {
    delete process.env.AWS_REGION;
    
    expect(() => {
      new S3Service();
    }).toThrow();
  });
});
