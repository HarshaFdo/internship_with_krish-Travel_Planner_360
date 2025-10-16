import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("flights")
  getFlights(
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("date") date?: string
  ) {
    return this.appService.getFlights(from, to, date);
  }

  @Get("flights/cheapest")
  getCheapestFlight(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("date") date?: string
  ) {
    const cheapest = this.appService.getCheapestFlight(from, to);

    if (!cheapest) {
      throw new NotFoundException({
        message: "No flight is found for your specified route.",
        from,
        to,
        date: date || "any",
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
