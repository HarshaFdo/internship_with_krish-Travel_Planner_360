import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { GetWeatherDto } from "./dto/get-weather.dto";
import { UpdateDelayDto } from "./dto/update-delay.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("weather")
  async getWeather(
    @Query() query: GetWeatherDto
  ) {
    try {
      return await this.appService.getWeather(query.destination, query.date);
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

  @Get("healthy")
  getHealthy() {
    return this.appService.getHealthy();
  }

  // Endpoint to update delay
  @Put("config/delay")
  updateDelay(@Body() updateDelayDto: UpdateDelayDto) {
    return this.appService.updateDelay(updateDelayDto.delayMs);
  }

  // Endpoint to reset the delay to orginal
  @Post("config/delay/reset")
  resetDelay() {
    return this.appService.resetDelay();
  }
}
