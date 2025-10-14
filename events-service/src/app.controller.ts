import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("events")
  getEvents(
    @Query("destination") destination?: string,
    @Query("date") date?: string,
    @Query("category") category?: string
  ) {
    return this.appService.getEvents(destination, date, category);
  }

  @Get("healthy")
  getHealthy() {
    return this.appService.getHealthy();
  }
}
