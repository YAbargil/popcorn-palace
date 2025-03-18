import {
  IsInt,
  IsNumber,
  IsString,
  IsDateString,
  IsPositive,
  Validate,
} from 'class-validator';
import { CustomStartEndTimeValidator } from '../validator/start-end-time.validator';

export class CreateShowtimeDto {
  @IsInt()
  movieId: number;

  @IsString()
  theater: string;

  @IsDateString()
  @Validate(CustomStartEndTimeValidator, ['endTime']) // Validator to check start < end
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
