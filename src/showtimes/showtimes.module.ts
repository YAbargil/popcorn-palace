import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoviesService } from 'src/movies/movies.service';

@Module({
  providers: [ShowtimesService, MoviesService, PrismaService],
  controllers: [ShowtimesController],
})
export class ShowtimesModule {}
