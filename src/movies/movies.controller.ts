import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  async getAllMovies(): Promise<Movie[]> {
    return this.moviesService.getAllMovies();
  }

  @Post()
  @HttpCode(200)
  async createMovie(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Post('update/:movieTitle')
  @HttpCode(200)
  async updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updateDto: CreateMovieDto,
  ): Promise<Movie> {
    const movie = await this.moviesService.getMovieByTitle(movieTitle);

    if (!movie) throw new NotFoundException('Movie not found');

    return this.moviesService.updateMovie(movie.id, updateDto);
  }

  @Delete(':movieTitle')
  async deleteMovie(@Param('movieTitle') movieTitle: string): Promise<Movie> {
    const movie = await this.moviesService.getMovieByTitle(movieTitle);

    if (!movie) throw new NotFoundException('Movie not found');

    return this.moviesService.deleteMovie(movie.id);
  }
}
