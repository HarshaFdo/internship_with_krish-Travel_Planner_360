import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("weather")
  async getWeather(
    @Query("destination") destination?: string,
    @Query("date") date?: string
  ) {
    try {
      return await this.appService.getWeather(destination ?? "", date ?? "");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Weather service error";

      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  @Get("set-delay")
  changeDelay() {
    this.appService.updateDelay(5000);
    return;
  }

  @Get("healthy")
  getHealthy() {
    return this.appService.getHealthy();
  }
}
