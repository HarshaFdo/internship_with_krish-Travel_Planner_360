import { Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { SearchHotelsDto } from "./dto/search-hotels.dto";
import { GetCheapestHotelsDto } from "./dto/get-cheapest-hotels";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hotels")
  getHotels(
    @Query() query: SearchHotelsDto
  ) {
    return this.appService.getHotels(query);
  }

  @Get("hotels/cheapest")
  getCheapestHotel(
    @Query() query: GetCheapestHotelsDto
  ) {
    const isLateCheckIn = query.lateCheckIn === "true";
    const cheapest = this.appService.getCheapestHotel(
      query.destination,
      isLateCheckIn
    );

    if (!cheapest) {
      throw new NotFoundException({
        message: "No hotel is found for your specified destination.",
        destination: query.destination,
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
