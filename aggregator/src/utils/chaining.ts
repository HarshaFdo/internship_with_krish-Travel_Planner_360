import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { AggregatorService } from '../services/aggregator.service';

@Injectable()
export class Chaining {
  private readonly logger = new Logger(Chaining.name);

  constructor(
    @Inject(forwardRef(() => AggregatorService))
    private readonly aggregatorService: AggregatorService) {}

  async execute(from: string, to: string, date: string) {
    const startTime = Date.now();
    this.logger.log(
      `[Chaining] is starting squential ochestration for ${from} -> ${to} on `
    );

    const elapsedTime = Date.now() - startTime;

    try {
      // step 1: getting the cheapest flight
      this.logger.log("[Chaining] 1. Fetching the cheapest fright...");
      const flightResponse = await this.aggregatorService.getCheapestFlight(
        from,
        to,
        date
      );

      if (!flightResponse.flights) {
        this.logger.warn(`[Chaining] No flight is found`);
        throw new NotFoundException({
          message: "No flight is found for your specified route and date.",
          from,
          to,
          date,
        });
      }

      const flight = flightResponse.flights;
      const isLateArrival = flightResponse.lateArrival || false;

      this.logger.log(
        `[Chaining] 1- complete. Fetched the cheapest flight: ${flight.id} - Arrival: ${flight.arriveTime} - Late Arrival: ${isLateArrival}`
      );

      // step 2: getting the cheapest hotel based on the arrival time.
      this.logger.log(
        `[Chaining] 2. Fetching the cheapest hotel (lateArrival: ${isLateArrival}) ...`
      );
      const hotelResponse = await this.aggregatorService.getCheapestHotel(
        to,
        isLateArrival
      );

      if (!hotelResponse.hotels) {
        this.logger.warn(`[Chaining] No hotel is found`);
        throw new NotFoundException({
          message: "No hotel is found for your specified destination.",
          from,
          to,
          date,
        });
      }

      const hotel = hotelResponse.hotels;
      this.logger.log(
        `[Chaining] 2- complete. Fetched the cheapest hotel: ${hotel.id} - Late check-in: ${hotel.lateCheckIn}`
      );
      this.logger.log(`[Chaining] All done - total time: ${elapsedTime}ms`);

      return {
        flight: {
          id: flight.id,
          from: flight.from,
          to: flight.to,
          airline: flight.airline,
          date: flight.date,
          departTime: flight.departTime,
          arriveTime: flight.arriveTime,
          price: flight.price,
          class: flight.class,
        },
        hotel: {
          id: hotel.id,
          name: hotel.name,
          rating: hotel.rating,
          pricePerNight: hotel.pricePerNight,
          lateCheckIn: hotel.lateCheckIn,
        },
        metadata: {
          pattern: "Chaining",
          lateArrival: isLateArrival,
          elapsedTimeMs: elapsedTime,
          totalCost: flight.price + hotel.pricePerNight,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error";
      const errorStack = error instanceof Error ? error.stack : "";

      this.logger.error(
        `[Chaining] Error occurred: ${errorMessage}`,
        errorStack
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: errorMessage,
          metadata: {
            pattern: "Chaining",
            elapsedTimeMs: elapsedTime,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
