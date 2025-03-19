import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Booking, Showtime } from '@prisma/client';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: BookingsService;
  let showtimesService: ShowtimesService;

  const mockBookingsService = {
    isSeatAlreadyBooked: jest.fn(),
    createBooking: jest.fn(),
  };

  const mockShowtimesService = {
    getShowtimeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: ShowtimesService, useValue: mockShowtimesService },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    bookingsService = module.get<BookingsService>(BookingsService);
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    const bookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 15,
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    };

    it('should create a booking successfully', async () => {
      const showtime: Pick<Showtime, 'id'> = { id: 1 };
      const createdBooking: Booking = { id: 'booking-uuid', ...bookingDto };

      mockShowtimesService.getShowtimeById.mockResolvedValue(showtime);
      mockBookingsService.isSeatAlreadyBooked.mockResolvedValue(null);
      mockBookingsService.createBooking.mockResolvedValue(createdBooking);

      const result = await controller.createBooking(bookingDto);
      expect(result).toEqual(createdBooking);
      expect(showtimesService.getShowtimeById).toHaveBeenCalledWith(1);
      expect(bookingsService.isSeatAlreadyBooked).toHaveBeenCalledWith(
        bookingDto,
      );
      expect(bookingsService.createBooking).toHaveBeenCalledWith(bookingDto);
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      mockShowtimesService.getShowtimeById.mockResolvedValue(null);

      await expect(controller.createBooking(bookingDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if the seat is already booked', async () => {
      const showtime = { id: 1 };
      mockShowtimesService.getShowtimeById.mockResolvedValue(showtime);
      mockBookingsService.isSeatAlreadyBooked.mockResolvedValue(true);

      await expect(controller.createBooking(bookingDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
