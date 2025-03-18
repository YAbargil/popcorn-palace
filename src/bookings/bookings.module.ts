import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ShowtimesService } from 'src/showtimes/showtimes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BookingsService, ShowtimesService, PrismaService],
  controllers: [BookingsController],
})
export class BookingsModule {}
