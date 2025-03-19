import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    booking: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isSeatAlreadyBooked', () => {
    it('should return a booking if the seat is already booked', async () => {
      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };
      const existingBooking: Booking = { id: 'booking-uuid', ...dto };

      mockPrismaService.booking.findFirst.mockResolvedValue(existingBooking);

      const result = await service.isSeatAlreadyBooked(dto);
      expect(result).toEqual(existingBooking);
      expect(prisma.booking.findFirst).toHaveBeenCalledWith({
        where: { showtimeId: dto.showtimeId, seatNumber: dto.seatNumber },
      });
    });

    it('should return null if the seat is available', async () => {
      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };

      mockPrismaService.booking.findFirst.mockResolvedValue(null);

      const result = await service.isSeatAlreadyBooked(dto);
      expect(result).toBeNull();
      expect(prisma.booking.findFirst).toHaveBeenCalledWith({
        where: { showtimeId: dto.showtimeId, seatNumber: dto.seatNumber },
      });
    });
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      };
      const createdBooking = { id: 'booking-uuid', ...dto };

      mockPrismaService.booking.create.mockResolvedValue(createdBooking);

      const result = await service.createBooking(dto);
      expect(result).toEqual(createdBooking);
      expect(prisma.booking.create).toHaveBeenCalledWith({ data: dto });
    });
  });
});
