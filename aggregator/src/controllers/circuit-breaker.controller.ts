import { Controller, Get } from "@nestjs/common";
import { CircuitBreaker } from "../utils/circuit-breaker";
 

@Controller('v2/circuit-breaker')
export class CircuitBreakerController {

  constructor(private readonly circuitBreaker: CircuitBreaker) {}

  @Get()
  getCircuitBreakerState() {
    return this.circuitBreaker.getState();
  }
}