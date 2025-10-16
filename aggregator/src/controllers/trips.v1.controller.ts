import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ScatterGatherService } from "../services/patterns/scatter-gather.service";
import { ChainingService } from "../services/patterns/chaining.service";
import { BranchingService } from "../services/patterns/branching.service";
import { MetricsService } from "../services/metrics.service";

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
  async search(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("date") date: string
  ) {
    this.metricsService.trackRequest("v1", "/v1/trips/search");

    if (!from || !to || !date) {
      throw new BadRequestException(
        "Missing required query parameters: from, to, date"
      );
    }

    return this.scatterGatherService.execute(from, to, date);
  }

  // for chaining pattern
  @Get("cheapest-route")
  async cheapestRoute(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("date") date: string
  ) {
    this.metricsService.trackRequest("v1", "/v1/trips/cheapest-route");

    if (!from || !to || !date) {
      throw new BadRequestException(
        "Missing required query parameters: from, to, date"
      );
    }

    return this.chainingService.execute(from, to, date);
  }

  // for branching pattern
  @Get("contextual")
  async contextual(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("date") date: string
  ) {
    this.metricsService.trackRequest("v1", "/v1/trips/contextual");

    if (!from || !to || !date) {
      throw new BadRequestException(
        "Missing required query parameters: from, to, date"
      );
    }

    return this.branchingService.execute(from, to, date);
  }
}
