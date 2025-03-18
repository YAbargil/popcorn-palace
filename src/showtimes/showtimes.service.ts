import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from '@prisma/client';

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaService) {}

  async getShowtimeById(id: number): Promise<Showtime> {
    return this.prisma.showtime.findUnique({ where: { id } });
  }

  async createShowtime(dto: CreateShowtimeDto): Promise<Showtime> {
    return this.prisma.showtime.create({ data: dto });
  }

  async updateShowtime(id: number, dto: CreateShowtimeDto) {
    return this.prisma.showtime.update({ where: { id }, data: dto });
  }

  async deleteShowtime(id: number): Promise<Showtime> {
    return this.prisma.showtime.delete({ where: { id } });
  }

  async hasOverlappingShowtime(
    theater: string,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ): Promise<boolean> {
    const overlappingShowtime = await this.prisma.showtime.findFirst({
      where: {
        theater,
        AND: [
          { id: excludeId ? { not: excludeId } : undefined }, // Exclude current showtime if updating
          { startTime: { lt: endTime } }, // Starts before or at the new end time
          { endTime: { gt: startTime } }, // Ends after or at the new start time
        ],
      },
    });

    return !!overlappingShowtime;
  }
}
