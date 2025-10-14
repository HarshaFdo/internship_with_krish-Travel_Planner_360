import { Controller, Get } from "@nestjs/common";
import { MetricsService } from "../services/metrics.service";
import { CircuitBreakerService } from "../services/circuit-breaker.service";

@Controller("metrics")
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly circuitBreakerService: CircuitBreakerService
  ) {}

  @Get()
  getMetrics() {
    return this.metricsService.getMetrics();
  }

}
