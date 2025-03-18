import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMovies() {
    return this.prisma.movie.findMany();
  }

  async createMovie(dto: CreateMovieDto) {
    return this.prisma.movie.create({ data: dto });
  }

  async updateMovie(movieTitle: string, dto: CreateMovieDto) {
    const movie = await this.prisma.movie.findFirst({
      where: { title: movieTitle },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    return this.prisma.movie.update({
      where: { id: movie.id },
      data: dto,
    });
  }

  async deleteMovie(movieTitle: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { title: movieTitle },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    return this.prisma.movie.delete({ where: { id: movie.id } });
  }
}
