import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from "@nestjs/common";
import { ScatterGatherService } from "../services/patterns/scatter-gather.service";
import { HttpClientsService } from "../services/HttpClient.service";
import { MetricsService } from "../services/metrics.service";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { TripSearchDto } from "../dto/trip-search.dto";

@Controller("v2/trips")
export class TripsV2Controller {
  private readonly logger = new Logger(TripsV2Controller.name);

  constructor(
    private readonly scatterGatherService: ScatterGatherService,
    private readonly httpClientsService: HttpClientsService,
    private readonly metricsService: MetricsService,
    private readonly circuitBreakerService: CircuitBreakerService
  ) {}

  // for scatter-gather pattern
  @Get("search")
  async search(@Query() query: TripSearchDto) {
    this.metricsService.trackRequest("v2", "/v2/trips/search");

    this.logger.log(
      `[V2] /search called with from=${query.from}, to=${query.to}, date=${query.date}`
    );

    // pass true value to sinclude weather for v2 
    const response = await this.scatterGatherService.execute(
     query.from!,
     query.to!,
     query.date!,
     true // enable weather for v2
    );

    return {
      ...response,
      version: "v2",
    };
  }
}
