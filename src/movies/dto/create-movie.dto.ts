import { IsString, IsInt, IsNumber, Min, Max, Matches } from 'class-validator';

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
  @Matches(/^\d{4}$/, { message: 'Release year must be a 4-digit number' }) // Ensures exactly 4 digits
  @Max(new Date().getFullYear(), {
    message: 'Release year cannot be in the future',
  }) // Ensures not greater than the current year
  releaseYear: number;
}
