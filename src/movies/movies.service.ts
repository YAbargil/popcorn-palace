import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMovies() {
    return this.prisma.movie.findMany();
  }

  async getMovieById(id: number) {
    return this.prisma.movie.findUnique({ where: { id } });
  }

  async getMovieByTitle(title: string) {
    return this.prisma.movie.findFirst({ where: { title } });
  }

  async createMovie(dto: CreateMovieDto) {
    return this.prisma.movie.create({ data: dto });
  }

  async updateMovie(id: number, dto: CreateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: dto,
    });
  }

  async deleteMovie(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }
}
