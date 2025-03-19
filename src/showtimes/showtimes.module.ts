import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [ShowtimesService, PrismaService],
  controllers: [ShowtimesController],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
