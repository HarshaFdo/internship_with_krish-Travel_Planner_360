import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hotels")
  getHotels(
    @Query("destination") destination?: string,
    @Query("date") date?: string,
    @Query("lateCheckIn") lateCheckIn?: string
  ) {
    return this.appService.getHotels(destination, date, lateCheckIn);
  }

  @Get("hotels/cheapest")
  getCheapestHotel(
    @Query("destination") destination: string,
    @Query("lateCheckIn") lateCheckIn?: string
  ) {
    const isLateCheckIn = lateCheckIn === "true";
    const cheapest = this.appService.getCheapestHotel(
      destination,
      isLateCheckIn
    );

    if (!cheapest) {
      throw new NotFoundException({
        message: "No hotel is found for your specified destination.",
        destination,
        lateCheckInOnly: isLateCheckIn,
      });
    }

    return { hotels: cheapest };
  }

  @Get("healthy")
  getHealthy() {
    return this.appService.getHeathy();
  }
}
