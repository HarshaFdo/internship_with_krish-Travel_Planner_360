import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ScatterGatherService } from "../services/patterns/scatter-gather.service";
import { ChainingService } from "../services/patterns/chaining.service";
import { BranchingService } from "../services/patterns/branching.service";
import { MetricsService } from "../services/metrics.service";
import { TripSearchDto } from "../dto/trip-search.dto";

@Controller("v1/trips")
export class TripsV1Controller {
  constructor(
    private readonly scatterGatherService: ScatterGatherService,
    private readonly chainingService: ChainingService,
    private readonly branchingService: BranchingService,
    private readonly metricsService: MetricsService
  ) {}

  // for scatter-gather pattern
  @Get("search")
  async search(@Query() query: TripSearchDto) {
    this.metricsService.trackRequest("v1", "/v1/trips/search");
    return this.scatterGatherService.execute(query.from, query.to, query.date);
  }

  // for chaining pattern
  @Get("cheapest-route")
  async cheapestRoute(@Query() query: TripSearchDto) {
    this.metricsService.trackRequest("v1", "/v1/trips/cheapest-route");
    return this.chainingService.execute(query.from, query.to, query.date);
  }

  // for branching pattern
  @Get("contextual")
  async contextual(@Query() query: TripSearchDto) {
    this.metricsService.trackRequest("v1", "/v1/trips/contextual");
    return this.branchingService.execute(query.from, query.to, query.date);
  }
}
