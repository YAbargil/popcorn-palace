import { IsString, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number; // Duration in minutes

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number; // Rating out of 10

  @IsInt()
  @Min(1000) // In range 1000-currentYear
  @Max(new Date().getFullYear(), {
    message: 'Release year cannot be in the future',
  }) // Ensures not greater than the current year
  releaseYear: number;
}
