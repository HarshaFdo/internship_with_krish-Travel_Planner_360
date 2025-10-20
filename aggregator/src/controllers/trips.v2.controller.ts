import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
} from "@nestjs/common";
import { ScatterGather } from "../utils/scatter-gather";
import { TripSearchDto } from "../dto/trip-search.dto";
import { Metrics } from "../utils/metrics";
import { AggregatorService } from "../services/aggregator.service";
import { CircuitBreaker } from "../utils/circuit-breaker";

@Controller("v2/trips")
export class TripsV2Controller {
  private readonly logger = new Logger(TripsV2Controller.name);

  constructor(
    private readonly scatterGather: ScatterGather,
    private readonly metrics: Metrics,
    private readonly aggregatorService: AggregatorService
  ) {}

  // for scatter-gather pattern
  @Get("search")
  async search(@Query() query: TripSearchDto) {
    this.metrics.trackRequest("v2", "/v2/trips/search");

    this.logger.log(
      `[V2] /search called with from=${query.from}, to=${query.to}, date=${query.date}`
    );

    // pass true value to sinclude weather for v2
    const response = await this.aggregatorService.executeScatterGather(
      query.from!,
      query.to!,
      query.date!,
      true, // enable weather for v2
    );

    return {
      ...response,
      version: "v2",
    };
  }
}

@Controller("v2/circuit-breaker")
export class CircuitBreakerController {
  constructor(private readonly circuitBreaker: CircuitBreaker) {}

  @Get()
  getCircuitBreakerState() {
    return this.circuitBreaker.getState();
  }
}