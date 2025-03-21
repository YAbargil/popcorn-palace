import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Movie, Showtime } from '@prisma/client';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let showtimesService: ShowtimesService;
  let moviesService: MoviesService;

  const mockShowtimesService = {
    getShowtimeById: jest.fn(),
    createShowtime: jest.fn(),
    updateShowtime: jest.fn(),
    deleteShowtime: jest.fn(),
    hasOverlappingShowtime: jest.fn(),
  };

  const mockMoviesService = {
    getMovieById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        { provide: ShowtimesService, useValue: mockShowtimesService },
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getShowtimeById', () => {
    it('should return a showtime if found', async () => {
      const showtime: Showtime = {
        id: 1,
        movieId: 1,
        theater: 'Cinema 1',
        startTime: new Date(),
        endTime: new Date(),
        price: 50,
      };

      mockShowtimesService.getShowtimeById.mockResolvedValue(showtime);

      const result = await controller.getShowtimeById(1);
      expect(result).toEqual(showtime);
      expect(showtimesService.getShowtimeById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if showtime is not found', async () => {
      mockShowtimesService.getShowtimeById.mockResolvedValue(null);

      await expect(controller.getShowtimeById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createShowtime', () => {
    const startTime = new Date(),
      endTime = new Date(new Date().getTime() + 7200000);
    const showtimeDto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'Cinema 1',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      price: 50,
    };

    it('should create a showtime successfully', async () => {
      const movie: Movie = {
        id: 1,
        title: 'Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };
      const createdShowtime: Showtime = {
        id: 1,
        ...showtimeDto,
        startTime,
        endTime,
      };

      mockMoviesService.getMovieById.mockResolvedValue(movie);
      mockShowtimesService.hasOverlappingShowtime.mockResolvedValue(false);
      mockShowtimesService.createShowtime.mockResolvedValue(createdShowtime);

      const result = await controller.createShowtime(showtimeDto);
      expect(result).toEqual(createdShowtime);
      expect(moviesService.getMovieById).toHaveBeenCalledWith(1);
      expect(showtimesService.createShowtime).toHaveBeenCalledWith(showtimeDto);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      mockMoviesService.getMovieById.mockResolvedValue(null);

      await expect(controller.createShowtime(showtimeDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if showtime overlaps', async () => {
      const movie: Movie = {
        id: 1,
        title: 'Movie',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };
      mockMoviesService.getMovieById.mockResolvedValue(movie);
      mockShowtimesService.hasOverlappingShowtime.mockResolvedValue(true);

      await expect(controller.createShowtime(showtimeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateShowtime', () => {
    const startTime = new Date(),
      endTime = new Date(new Date().getTime() + 7200000);
    const updateDto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'Cinema 1',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      price: 60,
    };

    it('should update a showtime successfully', async () => {
      const existingShowtime: Showtime = {
        id: 1,
        ...updateDto,
        startTime,
        endTime,
      };

      mockShowtimesService.getShowtimeById.mockResolvedValue(existingShowtime);
      mockShowtimesService.hasOverlappingShowtime.mockResolvedValue(false);
      mockShowtimesService.updateShowtime.mockResolvedValue(existingShowtime);

      const result = await controller.updateShowtime(1, updateDto);
      expect(result).toEqual(existingShowtime);
      expect(showtimesService.updateShowtime).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      mockShowtimesService.getShowtimeById.mockResolvedValue(null);

      await expect(controller.updateShowtime(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if updated showtime overlaps', async () => {
      mockShowtimesService.getShowtimeById.mockResolvedValue(updateDto);
      mockShowtimesService.hasOverlappingShowtime.mockResolvedValue(true);

      await expect(controller.updateShowtime(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteShowtime', () => {
    it('should delete a showtime successfully', async () => {
      const showtime: Showtime = {
        id: 1,
        movieId: 1,
        theater: 'Cinema 1',
        startTime: new Date(),
        endTime: new Date(),
        price: 50,
      };

      mockShowtimesService.getShowtimeById.mockResolvedValue(showtime);
      mockShowtimesService.deleteShowtime.mockResolvedValue(showtime);

      const result = await controller.deleteShowtime(1);
      expect(result).toEqual(showtime);
      expect(showtimesService.deleteShowtime).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      mockShowtimesService.getShowtimeById.mockResolvedValue(null);

      await expect(controller.deleteShowtime(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
