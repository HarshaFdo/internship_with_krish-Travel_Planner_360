import { Module } from "@nestjs/common";
import { HttpClients } from "./utils/HttpClient";
import { HttpModule } from "@nestjs/axios";
import { MetricsController, TripsV1Controller } from "./controllers/trips.v1.controller";
import { ScatterGather } from "./utils/scatter-gather";
import { Chaining } from "./utils/chaining";
import { Branching } from "./utils/branching";
import { TripsV2Controller } from "./controllers/trips.v2.controller";
import { CircuitBreaker } from "./utils/circuit-breaker";
import { CircuitBreakerController } from "./controllers/circuit-breaker.controller";
import { AggregatorService } from "./services/aggregator.service";
import { ConfigModule } from "@nestjs/config";

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
    HttpClients,
    AggregatorService,
    ScatterGather,
    Chaining,
    Branching,
    CircuitBreaker,
  ],
})
export class AppModule {}
