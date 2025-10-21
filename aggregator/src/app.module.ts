import { Module } from "@nestjs/common";
import { HttpClient } from "./utils/HttpClient";
import { HttpModule } from "@nestjs/axios";
import { MetricsController, TripsV1Controller } from "./controllers/trips.v1.controller";
import { ScatterGather } from './utils/scatter-gather';
import { Chaining } from "./utils/chaining";
import { Branching } from "./utils/branching";
import { CircuitBreakerController, TripsV2Controller } from "./controllers/trips.v2.controller";
import { CircuitBreaker } from "./utils/circuit-breaker";
import { AggregatorService } from "./services/aggregator.service";
import { ConfigModule } from "@nestjs/config";
import { Metrics } from "./utils/metrics";

@Module({
  imports: [
    HttpModule.register({
      timeout: 6000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({isGlobal: true})
  ],
  controllers: [
    TripsV1Controller,
    TripsV2Controller,
    MetricsController,
    CircuitBreakerController,
  ],
  providers: [
    HttpClient,
    AggregatorService,
    ScatterGather,
    Chaining,
    Branching,
    CircuitBreaker,
    Metrics,
  ],
})
export class AppModule {}
