import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';
import { ShowtimesService } from 'src/showtimes/showtimes.service';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly showtimesService: ShowtimesService,
  ) {}

  @Post()
  async createBooking(
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const showtime = await this.showtimesService.getShowtimeById(
      createBookingDto.showtimeId,
    );
    if (!showtime) throw new NotFoundException('Showtime nots found');

    const isBooked = this.bookingsService.isSeatAlreadyBooked(createBookingDto);

    if (isBooked) {
      throw new BadRequestException('Seat is already booked for this showtime');
    }
    return this.bookingsService.createBooking(createBookingDto);
  }
}
