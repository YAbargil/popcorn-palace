import { IsInt, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  showtimeId: number;

  @IsInt()
  seatNumber: number;

  @IsUUID()
  userId: string;
}
