import { Controller, Get } from "@nestjs/common";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
 

@Controller('v2/circuit-breaker')
export class CircuitBreakerController {

  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  @Get()
  getCircuitBreakerState() {
    return this.circuitBreakerService.getState();
  }
}