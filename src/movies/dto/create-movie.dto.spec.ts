import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateMovieDto } from './create-movie.dto';

async function validateDto(dto: CreateMovieDto) {
  const object = plainToInstance(CreateMovieDto, dto);
  return validate(object);
}

describe('CreateMovieDto Validation', () => {
  it('should pass for a valid movie', async () => {
    const dto: CreateMovieDto = {
      title: 'Valid Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2024,
    };

    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if title is not a string', async () => {
    const dto: any = {
      title: 123,
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2024,
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail if duration is less than 1', async () => {
    const dto: CreateMovieDto = {
      title: 'Movie',
      genre: 'Action',
      duration: 0,
      rating: 8.5,
      releaseYear: 2024,
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('duration');
  });

  it('should fail if releaseYear is in the future', async () => {
    const nextYear = new Date().getFullYear() + 1;
    const dto: CreateMovieDto = {
      title: 'Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: nextYear,
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.max).toBe(
      'Release year cannot be in the future',
    );
  });
});
