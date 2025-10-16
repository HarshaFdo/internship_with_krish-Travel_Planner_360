import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { SearchFlightDto } from "./dto/search-flights.dto";
import { GetCheapestFlightDto } from './dto/get-cheapest-flight.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("flights")
  getFlights(
    @Query()
    query: SearchFlightDto
  ) {
    return this.appService.getFlights(query);
  }

  @Get("flights/cheapest")
  getCheapestFlight(
    @Query()
      query: GetCheapestFlightDto
  ) {
    const cheapest = this.appService.getCheapestFlight(query);

    if (!cheapest) {
      throw new NotFoundException({
        message: "No flight is found for your specified route.",
        from: query.from,
        to: query.to,
        date: query.date || "any",
      });
    }

    const isLateArrival = this.appService.isLateArrival(cheapest.arriveTime);

    return {
      flights: cheapest,
      lateArrival: isLateArrival,
    };
  }

  @Get("healthy")
  getHealthy() {
    return this.appService.getHealthy();
  }
}
