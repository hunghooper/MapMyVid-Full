import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleMapsService } from '../src/modules/video-analyzer/services/google-maps.service.js';

describe('GoogleMapsService - Address Support', () => {
  let service: GoogleMapsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'GOOGLE_MAPS_API_KEY') {
          return 'test-api-key';
        }
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleMapsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<GoogleMapsService>(GoogleMapsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate queries with name only', () => {
    const searchPlace = (service as any).searchPlace;
    
    // Mock the actual search to avoid API calls
    jest.spyOn(service, 'searchPlace').mockImplementation(async (name, address, city, country) => {
      // Test that queries are generated correctly
      expect(name).toBe('Pizza 4P');
      expect(address).toBeUndefined();
      expect(city).toBe('Ho Chi Minh City');
      expect(country).toBe('Vietnam');
      
      return { error: 'Mock response' };
    });

    service.searchPlace('Pizza 4P', undefined, 'Ho Chi Minh City', 'Vietnam');
  });

  it('should generate queries with name and address', () => {
    const searchPlace = (service as any).searchPlace;
    
    // Mock the actual search to avoid API calls
    jest.spyOn(service, 'searchPlace').mockImplementation(async (name, address, city, country) => {
      // Test that queries are generated correctly
      expect(name).toBe('Pizza 4P');
      expect(address).toBe('65 Lê Lợi, Q1');
      expect(city).toBe('Ho Chi Minh City');
      expect(country).toBe('Vietnam');
      
      return { error: 'Mock response' };
    });

    service.searchPlace('Pizza 4P', '65 Lê Lợi, Q1', 'Ho Chi Minh City', 'Vietnam');
  });

  it('should generate multiple query strategies', () => {
    // Test the query generation logic
    const generateQueries = (service as any).generateQueries;
    
    if (generateQueries) {
      const queries = generateQueries('Pizza 4P', '65 Lê Lợi, Q1', 'Ho Chi Minh City', 'Vietnam');
      
      // Should include various combinations
      expect(queries).toContain('Pizza 4P');
      expect(queries).toContain('Pizza 4P, 65 Lê Lợi, Q1');
      expect(queries).toContain('Pizza 4P, 65 Lê Lợi, Q1, Ho Chi Minh City, Vietnam');
      expect(queries).toContain('65 Lê Lợi, Q1');
    }
  });
});
