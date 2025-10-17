import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from "@nestjs/common";
import { ScatterGatherService } from "../services/patterns/scatter-gather.service";
import { ClientsService } from "../services/HttpClientService";
import { MetricsService } from "../services/metrics.service";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { TripSearchDto } from "../dto/trip-search.dto";

@Controller("v2/trips")
export class TripsV2Controller {
  private readonly logger = new Logger(TripsV2Controller.name);

  constructor(
    private readonly scatterGatherService: ScatterGatherService,
    private readonly clientsService: ClientsService,
    private readonly metricsService: MetricsService,
    private readonly circuitBreakerService: CircuitBreakerService
  ) {}

  // for scatter-gather pattern
  @Get("search")
  async search(@Query() query: TripSearchDto) {
    this.metricsService.trackRequest("v2", "/v2/trips/search");

    const v1Response = await this.scatterGatherService.execute(
      query.from,
      query.to,
      query.date
    );

    this.logger.log(
      `[V2] /search called with from=${query.from}, to=${query.to}, date=${query.date}`
    );

    //  circuit breaker for weather service
    const weather = await this.circuitBreakerService.execute(
      () => this.clientsService.getWeather(query.to!, query.date!),
      () => ({
        summary: "unavailable",
        degraded: true,
        error: "Weather service temporarily unavailable",
      }),
      "weather-service"
    );

    return {
      ...v1Response,
      weather,
      version: "v2",
    };
  }
}
