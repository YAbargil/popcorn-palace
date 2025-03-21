import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

// Mocking PrismaService
const mockPrismaService = {
  showtime: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getShowtimeById', () => {
    it('should return a showtime', async () => {
      const mockShowtime = {
        id: 1,
        movieId: 1,
        theater: 'Theater 1',
        startTime: new Date('2025-03-21T10:00:00Z'),
        endTime: new Date('2025-03-21T12:00:00Z'),
        price: 10,
      };

      prismaService.showtime.findUnique.mockResolvedValue(mockShowtime);

      const result = await service.getShowtimeById(1);
      expect(result).toEqual(mockShowtime);
    });

    it('should return null if no showtime is found', async () => {
      prismaService.showtime.findUnique.mockResolvedValue(null);

      const result = await service.getShowtimeById(1);
      expect(result).toBeNull();
    });
  });

  describe('createShowtime', () => {
    it('should create a showtime', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
        price: 10,
      };

      const mockShowtime = {
        id: 1,
        ...createShowtimeDto,
      };

      prismaService.showtime.create.mockResolvedValue(mockShowtime);

      const result = await service.createShowtime(createShowtimeDto);
      expect(result).toEqual(mockShowtime);
    });
  });

  describe('updateShowtime', () => {
    it('should update a showtime', async () => {
      const updateShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Theater 1',
        startTime: '2025-03-21T10:00:00Z',
        endTime: '2025-03-21T12:00:00Z',
        price: 15,
      };

      const mockShowtime = {
        id: 1,
        ...updateShowtimeDto,
      };

      prismaService.showtime.update.mockResolvedValue(mockShowtime);

      const result = await service.updateShowtime(1, updateShowtimeDto);
      expect(result).toEqual(mockShowtime);
    });
  });

  describe('deleteShowtime', () => {
    it('should delete a showtime', async () => {
      const mockShowtime = {
        id: 1,
        movieId: 1,
        theater: 'Theater 1',
        startTime: new Date('2025-03-21T10:00:00Z'),
        endTime: new Date('2025-03-21T12:00:00Z'),
        price: 10,
      };

      prismaService.showtime.delete.mockResolvedValue(mockShowtime);

      const result = await service.deleteShowtime(1);
      expect(result).toEqual(mockShowtime);
    });
  });

  describe('hasOverlappingShowtime', () => {
    const theaterName = 'MockTheater';

    it('should return true if overlapping showtime exists', async () => {
      const overlappingShowtime = {
        id: 2,
        movieId: 2,
        theater: theaterName,
        startTime: new Date('2025-03-21T11:00:00Z'),
        endTime: new Date('2025-03-21T13:00:00Z'),
        price: 12,
      };

      prismaService.showtime.findFirst.mockResolvedValue(overlappingShowtime);

      const result = await service.hasOverlappingShowtime(
        theaterName,
        '2025-03-21T10:00:00Z',
        '2025-03-21T12:00:00Z',
      );
      expect(result).toBe(true);
    });

    it('should return false if no overlapping showtime exists', async () => {
      prismaService.showtime.findFirst.mockResolvedValue(null);

      const result = await service.hasOverlappingShowtime(
        theaterName,
        '2025-03-21T10:00:00Z',
        '2025-03-21T12:00:00Z',
      );
      expect(result).toBe(false);
    });
  });
});
