import {
  IsInt,
  IsNumber,
  IsString,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { IsAfter } from '../validator/start-end-time.validator';

export class CreateShowtimeDto {
  @IsInt()
  movieId: number;

  @IsString()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  @IsAfter('startTime', { message: 'End time must be after start time' })
  endTime: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
