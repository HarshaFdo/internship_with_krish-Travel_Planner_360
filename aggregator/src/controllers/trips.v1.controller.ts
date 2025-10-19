import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ScatterGather } from "../utils/scatter-gather";
import { Chaining } from "../utils/chaining";
import { Branching } from "../utils/branching";
import { TripSearchDto } from "../dto/trip-search.dto";
import { AggregatorService } from "../services/aggregator.service";
import { CircuitBreaker } from "../utils/circuit-breaker";

@Controller("v1/trips")
export class TripsV1Controller {
  constructor(
    private readonly scatterGather: ScatterGather,
    private readonly chaining: Chaining,
    private readonly branching: Branching,
    private readonly metrics: AggregatorService
  ) {}

  // for scatter-gather pattern
  @Get("search")
  async search(@Query() query: TripSearchDto) {
    this.metrics.trackRequest("v1", "/v1/trips/search");
    return this.scatterGather.execute(query.from, query.to, query.date);
  }

  // for chaining pattern
  @Get("cheapest-route")
  async cheapestRoute(@Query() query: TripSearchDto) {
    this.metrics.trackRequest("v1", "/v1/trips/cheapest-route");
    return this.chaining.execute(query.from, query.to, query.date);
  }

  // for branching pattern
  @Get("contextual")
  async contextual(@Query() query: TripSearchDto) {
    this.metrics.trackRequest("v1", "/v1/trips/contextual");
    return this.branching.execute(query.from, query.to, query.date);
  }
}

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metrics: AggregatorService) {}

  @Get()
  getMetrics() {
    return this.metrics.getMetrics();
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
