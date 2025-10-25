import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from '../src/modules/locations/locations.service.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LocationType } from '@prisma/client';

describe('LocationsService - Favorite Functionality', () => {
  let service: LocationsService;
  let prismaService: PrismaService;

  const mockLocation = {
    id: 'location-1',
    videoId: 'video-1',
    originalName: 'Test Restaurant',
    type: LocationType.RESTAURANT,
    context: 'Test context',
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    video: {
      userId: 'user-1'
    }
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com'
  };

  beforeEach(async () => {
    const mockPrismaService = {
      location: {
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        delete: jest.fn()
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status from false to true', async () => {
      const locationWithFalse = { ...mockLocation, isFavorite: false };
      const updatedLocation = { ...mockLocation, isFavorite: true };

      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(locationWithFalse);
      (prismaService.location.update as jest.Mock).mockResolvedValue(updatedLocation);

      const result = await service.toggleFavorite('user-1', 'location-1');

      expect(prismaService.location.findFirst).toHaveBeenCalledWith({
        where: { id: 'location-1', video: { userId: 'user-1' } }
      });
      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: { id: 'location-1' },
        data: { isFavorite: true }
      });
      expect(result).toEqual(updatedLocation);
    });

    it('should toggle favorite status from true to false', async () => {
      const locationWithTrue = { ...mockLocation, isFavorite: true };
      const updatedLocation = { ...mockLocation, isFavorite: false };

      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(locationWithTrue);
      (prismaService.location.update as jest.Mock).mockResolvedValue(updatedLocation);

      const result = await service.toggleFavorite('user-1', 'location-1');

      expect(prismaService.location.findFirst).toHaveBeenCalledWith({
        where: { id: 'location-1', video: { userId: 'user-1' } }
      });
      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: { id: 'location-1' },
        data: { isFavorite: false }
      });
      expect(result).toEqual(updatedLocation);
    });

    it('should throw BadRequestException when userId is missing', async () => {
      await expect(service.toggleFavorite('', 'location-1')).rejects.toThrow(BadRequestException);
      expect(prismaService.location.findFirst).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when locationId is missing', async () => {
      await expect(service.toggleFavorite('user-1', '')).rejects.toThrow(BadRequestException);
      expect(prismaService.location.findFirst).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when location is not found', async () => {
      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.toggleFavorite('user-1', 'location-1')).rejects.toThrow(NotFoundException);
      expect(prismaService.location.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when database update fails', async () => {
      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(mockLocation);
      (prismaService.location.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.toggleFavorite('user-1', 'location-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByUser with favoritesOnly filter', () => {
    it('should return only favorite locations when favoritesOnly is true', async () => {
      const favoriteLocations = [
        { ...mockLocation, id: 'location-1', isFavorite: true },
        { ...mockLocation, id: 'location-2', isFavorite: true }
      ];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(favoriteLocations);
      (prismaService.location.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAllByUser('user-1', { favoritesOnly: true });

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          video: { userId: 'user-1' },
          isFavorite: true
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20
      });
      expect(result.data).toEqual(favoriteLocations);
      expect(result.total).toBe(2);
    });

    it('should return all locations when favoritesOnly is false', async () => {
      const allLocations = [
        { ...mockLocation, id: 'location-1', isFavorite: true },
        { ...mockLocation, id: 'location-2', isFavorite: false }
      ];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(allLocations);
      (prismaService.location.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAllByUser('user-1', { favoritesOnly: false });

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          video: { userId: 'user-1' }
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20
      });
      expect(result.data).toEqual(allLocations);
    });

    it('should combine favoritesOnly filter with videoId filter', async () => {
      const favoriteLocations = [{ ...mockLocation, id: 'location-1', isFavorite: true }];

      (prismaService.location.findMany as jest.Mock).mockResolvedValue(favoriteLocations);
      (prismaService.location.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAllByUser('user-1', { 
        favoritesOnly: true, 
        videoId: 'video-1' 
      });

      expect(prismaService.location.findMany).toHaveBeenCalledWith({
        where: {
          video: { userId: 'user-1' },
          isFavorite: true,
          videoId: 'video-1'
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20
      });
    });
  });

  describe('create with isFavorite', () => {
    it('should create location with isFavorite set to true', async () => {
      const createData = {
        originalName: 'Test Restaurant',
        type: LocationType.RESTAURANT,
        context: 'Test context',
        isFavorite: true,
        video: { connect: { id: 'video-1' } }
      };

      const createdLocation = { ...mockLocation, isFavorite: true };
      (prismaService.location.create as jest.Mock).mockResolvedValue(createdLocation);

      const result = await service.create(createData);

      expect(prismaService.location.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(createdLocation);
    });

    it('should create location with isFavorite set to false by default', async () => {
      const createData = {
        originalName: 'Test Restaurant',
        type: LocationType.RESTAURANT,
        context: 'Test context',
        video: { connect: { id: 'video-1' } }
      };

      const createdLocation = { ...mockLocation, isFavorite: false };
      (prismaService.location.create as jest.Mock).mockResolvedValue(createdLocation);

      const result = await service.create(createData);

      expect(prismaService.location.create).toHaveBeenCalledWith({ data: createData });
      expect(result).toEqual(createdLocation);
    });
  });

  describe('setFavorite', () => {
    it('should set favorite status to true', async () => {
      const updatedLocation = { ...mockLocation, isFavorite: true };

      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(mockLocation);
      (prismaService.location.update as jest.Mock).mockResolvedValue(updatedLocation);

      const result = await service.setFavorite('user-1', 'location-1', true);

      expect(prismaService.location.findFirst).toHaveBeenCalledWith({
        where: { id: 'location-1', video: { userId: 'user-1' } }
      });
      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: { id: 'location-1' },
        data: { isFavorite: true }
      });
      expect(result).toEqual(updatedLocation);
    });

    it('should set favorite status to false', async () => {
      const updatedLocation = { ...mockLocation, isFavorite: false };

      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(mockLocation);
      (prismaService.location.update as jest.Mock).mockResolvedValue(updatedLocation);

      const result = await service.setFavorite('user-1', 'location-1', false);

      expect(prismaService.location.findFirst).toHaveBeenCalledWith({
        where: { id: 'location-1', video: { userId: 'user-1' } }
      });
      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: { id: 'location-1' },
        data: { isFavorite: false }
      });
      expect(result).toEqual(updatedLocation);
    });

    it('should throw BadRequestException when userId is missing', async () => {
      await expect(service.setFavorite('', 'location-1', true)).rejects.toThrow(BadRequestException);
      expect(prismaService.location.findFirst).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when locationId is missing', async () => {
      await expect(service.setFavorite('user-1', '', true)).rejects.toThrow(BadRequestException);
      expect(prismaService.location.findFirst).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when isFavorite is not a boolean', async () => {
      await expect(service.setFavorite('user-1', 'location-1', 'true' as any)).rejects.toThrow(BadRequestException);
      expect(prismaService.location.findFirst).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when location is not found', async () => {
      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.setFavorite('user-1', 'location-1', true)).rejects.toThrow(NotFoundException);
      expect(prismaService.location.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when database update fails', async () => {
      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(mockLocation);
      (prismaService.location.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.setFavorite('user-1', 'location-1', true)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateByUser with isFavorite', () => {
    it('should update isFavorite field', async () => {
      const updateData = { isFavorite: true };
      const updatedLocation = { ...mockLocation, isFavorite: true };

      (prismaService.location.findFirst as jest.Mock).mockResolvedValue(mockLocation);
      (prismaService.location.update as jest.Mock).mockResolvedValue(updatedLocation);

      const result = await service.updateByUser('user-1', 'location-1', updateData);

      expect(prismaService.location.findFirst).toHaveBeenCalledWith({
        where: { id: 'location-1', video: { userId: 'user-1' } }
      });
      expect(prismaService.location.update).toHaveBeenCalledWith({
        where: { id: 'location-1' },
        data: updateData
      });
      expect(result).toEqual(updatedLocation);
    });
  });
});
