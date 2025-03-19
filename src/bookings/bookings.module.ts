import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShowtimesModule } from 'src/showtimes/showtimes.module';

@Module({
  imports: [ShowtimesModule],
  providers: [BookingsService, PrismaService],
  controllers: [BookingsController],
})
export class BookingsModule {}
