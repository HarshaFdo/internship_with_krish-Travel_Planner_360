import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { SearchEventsDto } from "./dto/search-events.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("events")
  getEvents(
    @Query() query: SearchEventsDto
  ) {
    return this.appService.getEvents(query);
  }

  @Get("healthy")
  getHealthy() {
    return this.appService.getHealthy();
  }
}
