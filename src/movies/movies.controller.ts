import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  @Post()
  createMovie(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Post('update/:movieTitle')
  updateMovie(
    @Param('movieTitle') movieTitle: string,
    @Body() updateDto: CreateMovieDto,
  ) {
    return this.moviesService.updateMovie(movieTitle, updateDto);
  }

  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.deleteMovie(movieTitle);
  }
}
