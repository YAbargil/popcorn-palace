import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from '@prisma/client';
import { MoviesService } from 'src/movies/movies.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(
    private readonly showtimesService: ShowtimesService,
    private readonly moviesService: MoviesService,
  ) {}

  @Get(':id')
  async getShowtimeById(@Param('id') id: number): Promise<Showtime> {
    const showtime = this.showtimesService.getShowtimeById(id);

    if (!showtime) throw new NotFoundException('Showtime not found');

    return showtime;
  }

  @Post()
  @HttpCode(200)
  async createShowtime(
    @Body(ValidationPipe) createShowtimeDto: CreateShowtimeDto,
  ): Promise<Showtime> {
    const movie = await this.moviesService.getMovieById(
      createShowtimeDto.movieId,
    );

    if (!movie) throw new NotFoundException('Movie not found');

    const isOverlapping = await this.showtimesService.hasOverlappingShowtime(
      createShowtimeDto.theater,
      createShowtimeDto.startTime,
      createShowtimeDto.endTime,
    );

    if (isOverlapping) {
      throw new BadRequestException(
        'Overlapping showtime exists in the same theater',
      );
    }

    return this.showtimesService.createShowtime(createShowtimeDto);
  }

  @Post('update/:id')
  @HttpCode(200)
  async updateShowtime(
    @Param('id') id: number,
    @Body(ValidationPipe) updateDto: CreateShowtimeDto,
  ): Promise<Showtime> {
    const showtime = await this.showtimesService.getShowtimeById(id);

    if (!showtime) throw new NotFoundException('Showtime not found');

    const isOverlapping = await this.showtimesService.hasOverlappingShowtime(
      updateDto.theater,
      updateDto.startTime,
      updateDto.endTime,
      id,
    );

    if (isOverlapping) {
      throw new BadRequestException(
        'Updated showtime overlaps with another showtime in the same theater',
      );
    }
    return this.showtimesService.updateShowtime(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteShowtime(@Param('id') id: number): Promise<Showtime> {
    const showtime = await this.showtimesService.getShowtimeById(id);

    if (!showtime) throw new NotFoundException('Showtime not found');

    return this.showtimesService.deleteShowtime(id);
  }
}
