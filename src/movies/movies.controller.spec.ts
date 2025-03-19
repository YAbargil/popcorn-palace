import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { Movie } from '@prisma/client';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    getAllMovies: jest.fn().mockResolvedValue([]),
    getMovieByTitle: jest.fn(),
    createMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        {
          id: 1,
          title: 'Movie 1',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
        },
      ];

      mockMoviesService.getAllMovies.mockResolvedValue(movies);

      const result = await controller.getAllMovies();
      expect(result).toEqual(movies);
      expect(service.getAllMovies).toHaveBeenCalled();
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const dto: CreateMovieDto = {
        title: 'New Movie',
        genre: 'Drama',
        duration: 110,
        rating: 9.0,
        releaseYear: 2024,
      };
      const movie: Movie = { id: 1, ...dto };
      mockMoviesService.createMovie.mockResolvedValue(movie);

      const result = await controller.createMovie(dto);
      expect(result).toEqual(movie);
      expect(service.createMovie).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateMovie', () => {
    it('should update an existing movie while keeping other fields unchanged', async () => {
      const existingMovie: Movie = {
        id: 1,
        title: 'Original Movie',
        genre: 'Drama',
        duration: 120, // Original duration
        rating: 9.0,
        releaseYear: 2024,
      };

      const updateDto: CreateMovieDto = {
        title: existingMovie.title,
        genre: existingMovie.genre,
        duration: 135, // Only changing duration
        rating: existingMovie.rating,
        releaseYear: existingMovie.releaseYear,
      };

      const updatedMovie: Movie = { id: 1, ...updateDto }; // Merging changes into existing movie

      mockMoviesService.getMovieByTitle.mockResolvedValue(existingMovie);
      mockMoviesService.updateMovie.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie('Original Movie', updateDto);

      expect(result).toEqual(updatedMovie);
      expect(service.updateMovie).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      mockMoviesService.getMovieByTitle.mockResolvedValue(null);

      await expect(
        controller.updateMovie('Nonexistent Movie', {} as CreateMovieDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMovie', () => {
    it('should delete an existing movie', async () => {
      const existingMovie = {
        id: 1,
        title: 'Movie to Delete',
        genre: 'Horror',
        duration: 100,
        rating: 6.5,
        releaseYear: 2021,
      };

      mockMoviesService.getMovieByTitle.mockResolvedValue(existingMovie);
      mockMoviesService.deleteMovie.mockResolvedValue(existingMovie);

      const result = await controller.deleteMovie('Movie to Delete');
      expect(result).toEqual(existingMovie);
      expect(service.deleteMovie).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      mockMoviesService.getMovieByTitle.mockResolvedValue(null);

      await expect(controller.deleteMovie('Nonexistent Movie')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
