import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';

type MockPrismaService = typeof mockPrismaService;

const mockPrismaService = {
  movie: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get(PrismaService) as MockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return an empty array when no movies exist', async () => {
      prisma.movie.findMany.mockResolvedValue([]);
      expect(await service.getAllMovies()).toEqual([]);
    });

    it('should return a list of movies', async () => {
      const movies: Movie[] = [
        {
          id: 1,
          title: 'Movie 1',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
        },
        {
          id: 2,
          title: 'Movie 2',
          genre: 'Comedy',
          duration: 90,
          rating: 7.2,
          releaseYear: 2022,
        },
      ];
      prisma.movie.findMany.mockResolvedValue(movies);
      expect(await service.getAllMovies()).toEqual(movies);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movie: Movie = {
        id: 1,
        title: 'Movie 1',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
      };
      prisma.movie.findUnique.mockResolvedValue(movie);
      expect(await service.getMovieById(1)).toEqual(movie);
    });

    it('should return null if movie does not exist', async () => {
      prisma.movie.findUnique.mockResolvedValue(null);
      expect(await service.getMovieById(999)).toBeNull();
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const dto: CreateMovieDto = {
        title: 'New Movie',
        genre: 'Drama',
        duration: 110,
        rating: 9.0,
        releaseYear: 2024,
      };
      const createdMovie: Movie = { id: 1, ...dto };
      prisma.movie.create.mockResolvedValue(createdMovie);
      expect(await service.createMovie(dto)).toEqual(createdMovie);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const dto: CreateMovieDto = {
        title: 'Updated Movie',
        genre: 'Drama',
        duration: 115,
        rating: 9.1,
        releaseYear: 2024,
      };
      const updatedMovie: Movie = { id: 1, ...dto };
      prisma.movie.update.mockResolvedValue(updatedMovie);
      expect(await service.updateMovie(1, dto)).toEqual(updatedMovie);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const deletedMovie: Movie = {
        id: 1,
        title: 'Movie to Delete',
        genre: 'Horror',
        duration: 100,
        rating: 6.5,
        releaseYear: 2021,
      };
      prisma.movie.delete.mockResolvedValue(deletedMovie);
      expect(await service.deleteMovie(1)).toEqual(deletedMovie);
    });
  });
});
