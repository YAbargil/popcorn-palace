import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async isSeatAlreadyBooked(dto: CreateBookingDto) {
    return this.prisma.booking.findFirst({
      where: {
        showtimeId: dto.showtimeId,
        seatNumber: dto.seatNumber,
      },
    });
  }

  async createBooking(dto: CreateBookingDto) {
    return this.prisma.booking.create({ data: dto });
  }
}
