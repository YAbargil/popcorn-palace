import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [ShowtimesModule],
  providers: [BookingsService, PrismaService],
  controllers: [BookingsController],
})
export class BookingsModule {}
