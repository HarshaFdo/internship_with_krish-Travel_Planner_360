import { Injectable, Logger } from "@nestjs/common";
import { ScatterGather } from "../utils/scatter-gather";
import { Chaining } from "../utils/chaining";
import { Branching } from "../utils/branching";
import { CircuitBreaker } from "../utils/circuit-breaker";
import { HttpClients } from "../utils/HttpClient";

interface TrafficMetrics {
  v1Requests: number;
  v2Requests: number;
  startTime: Date;
}

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);
  private metrics: TrafficMetrics = {
    v1Requests: 0,
    v2Requests: 0,
    startTime: new Date(),
  };

  constructor(
    private readonly scatterGather: ScatterGather,
    private readonly chaining: Chaining,
    private readonly branching: Branching,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly httpClients: HttpClients
  ) {}

  // Metrics methods
  trackRequest(version: "v1" | "v2", endpoint: string) {
    const key = version === "v1" ? "v1Requests" : "v2Requests";
    this.metrics[key]++;
    this.logger.log(
      `[Metrics] ${version.toUpperCase()} request to ${endpoint} | Total ${version.toUpperCase()} requests: ${this.metrics[key]}`
    );
  }

  getMetrics() {
    const { v1Requests, v2Requests } = this.metrics;
    const total = v1Requests + v2Requests;

    const calcPercentage = (count: number) =>
      total ? ((count / total) * 100).toFixed(2) + "%" : "0.00%";

    return {
      v1Requests,
      v2Requests,
      totalRequests: total,
      v1Percentage: calcPercentage(v1Requests),
      v2Percentage: calcPercentage(v2Requests),
      uptime: this.getUptime(),
    };
  }

  private getUptime() {
    const now = new Date();
    const difference = now.getTime() - this.metrics.startTime.getTime();
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  // weather service with circuit breaker
  async fetchWeatherWithCircuitBreaker(destination: string, date: string) {
    this.logger.log(
      `[AggregatorService] Fetching weather for ${destination} on ${date}`
    );

    try {
      const weather = await this.circuitBreaker.execute(
        () => this.httpClients.getWeather(destination, date),
        () => ({
          destination,
          forecast: [],
          degraded: true,
          error: "Weather service temporarily unavailable",
        }),
        "weather-service"
      );

      if (weather.degraded) {
        this.logger.warn(`[AggregatorService] Weather service degraded`);
      } else {
        this.logger.log(
          `[AggregatorService] Weather fetched successfully for ${weather.destination}`
        );
      }

      return weather;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.logger.error(
        `[AggregatorService] Weather circuit breaker error: ${errorMessage}`
      );

      return {
        destination,
        forecast: [],
        degraded: true,
        error: "Weather service unavailable",
      };
    }
  }

  // TODO: Add aggregator pattern methods here later
  async executeScatterGather(
    from: string,
    to: string,
    date: string,
    includeWeather: boolean = false
  ) {
    const respone = await this.scatterGather.execute(from, to, date);

    if (includeWeather) {
      const weather = await this.fetchWeatherWithCircuitBreaker(to, date);
      respone.weather = weather;

      if (weather.degraded) {
        respone.degraded = true;
        respone.metadata.weatherError = weather.error;
      }
    }

    return respone;
  }

  async executeChaining(from: string, to: string, date: string) {
    return this.chaining.execute(from, to, date);
  }

  async executeBranching(from: string, to: string, date: string) {
    return this.branching.execute(from, to, date);
  }
}
