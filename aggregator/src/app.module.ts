import { Module } from "@nestjs/common";
import { ClientsService } from "./services/clients.service";
import { HttpModule } from "@nestjs/axios";
import { TripsV1Controller } from "./controllers/trips.v1.controller";
import { ScatterGatherService } from "./services/patterns/scatter-gather.service";
import { ChainingService } from "./services/patterns/chaining.service";
import { BranchingService } from "./services/patterns/branching.service";
import { TripsV2Controller } from "./controllers/trips.v2.controller";
import { MetricsService } from "./services/metrics.service";
import { MetricsController } from "./controllers/metrics.controller";
import { CircuitBreakerService } from "./services/circuit-breaker.service";
import { CircuitBreakerController } from "./controllers/circuit-breaker.controller";

@Module({
  imports: [
    HttpModule.register({
      timeout: 6000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TripsV1Controller, TripsV2Controller, MetricsController, CircuitBreakerController],
  providers: [
    ClientsService,
    MetricsService,
    ScatterGatherService,
    ChainingService,
    BranchingService,
    CircuitBreakerService
  ],
})
export class AppModule {}
