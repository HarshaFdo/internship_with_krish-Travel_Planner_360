import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);

  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private requests: boolean[] = []; // Tracking last 20 requests (true=success, false=failure)
  private halfOpenCount: number = 0;
  private openedAt: number = 0;

  async execute<T>( serviceCall: () => Promise<T>, fallback: () => T, serviceName: string = "service"): Promise<T> {
    // Check if circuit is OPEN
    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed < 30000) {
        // Still cooling down - use fallback
        this.logger.warn(`[${serviceName}] Circuit OPEN - using fallback`);
        return fallback();
      } else {
        // Cooldown done - try HALF-OPEN
        this.state = "HALF_OPEN";
        this.halfOpenCount = 0;
        this.logger.log(
          `[${serviceName}] Circuit: OPEN -> HALF_OPEN (testing recovery)`
        );
      }
    }

    // Try to execute
    try {
      const result = await serviceCall();

      this.requests.push(true);
      if (this.requests.length > 20) {
        this.requests.shift();
      }

      if (this.state === "HALF_OPEN") {
        this.halfOpenCount++;
        this.logger.log(`HALF_OPEN test ${this.halfOpenCount}/5 passed`);

        if (this.halfOpenCount >= 5) {
          this.state = "CLOSED";
          this.requests = [];
          this.logger.log("Circuit: HALF_OPEN -> CLOSED");
        }
      }

      return result;
    } catch (error) {
      this.requests.push(false);
      if (this.requests.length > 20) {
        this.requests.shift();
      }

      if (this.state === "HALF_OPEN") {
        this.state = "OPEN";
        this.openedAt = Date.now();
        this.logger.error("Circuit: HALF_OPEN -> OPEN - test failed");
      } else if (this.state === "CLOSED") {
        // Check failure rate with minimum sample size
        if (this.requests.length >= 10) {
          const failures = this.requests.filter((r) => !r).length;
          const failureRate = failures / this.requests.length;

          if (failureRate >= 0.5) {
            this.state = "OPEN";
            this.openedAt = Date.now();
            this.logger.error(
              `Circuit: CLOSED -> OPEN (${(failureRate * 100).toFixed(0)}% failures)`
            );
          }
        }
      }

      this.logger.error(
        `[${serviceName}] Service call failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      return fallback();
    }
  }

  getState() {
    const failures = this.requests.filter((r) => !r).length;
    return {
      state: this.state,
      failureRate:
        this.requests.length > 0
          ? `${((failures / this.requests.length) * 100).toFixed(0)}%`
          : "0%",
      requests: this.requests.length,
      halfOpenCount: this.halfOpenCount,
      openedAt: this.openedAt,
    };
  }
}
