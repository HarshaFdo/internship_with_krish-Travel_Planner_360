import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ScatterGather } from "../utils/scatter-gather";
import { Chaining } from "../utils/chaining";
import { Branching } from "../utils/branching";
import { CircuitBreaker } from "../utils/circuit-breaker";
import { HttpClient, SERVICE_URL } from "../utils/HttpClient";
import { Metrics } from "../utils/metrics";
import { ApiVersion } from "../types";

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly scatterGather: ScatterGather,
    @Inject(forwardRef(() => Chaining))
    private readonly chaining: Chaining,
    private readonly branching: Branching,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly httpClient: HttpClient,
    private readonly metrics: Metrics
  ) {}

  // weather service with circuit breaker
  async fetchWeatherWithCircuitBreaker(destination: string, date: string) {
    this.logger.log(
      `[AggregatorService] Fetching weather for ${destination} on ${date}`
    );

    try {
      const weather = await this.circuitBreaker.execute(
        () =>
          this.httpClient.call(`${SERVICE_URL.weather}/weather`, {
            destination,
            date,
          }),
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

  // Aggregator pattern methods
  async executeScatterGather(
    from: string,
    to: string,
    date: string,
    includeWeather: boolean = false,
    version: ApiVersion = "v1"
  ) {
    this.metrics.trackRequest(version, "scatter-gather");

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

  async executeChaining(
    from: string,
    to: string,
    date: string,
    version: ApiVersion
  ) {
    this.metrics.trackRequest(version, "chaining");
    return this.chaining.execute(from, to, date);
  }

  async executeBranching(
    from: string,
    to: string,
    date: string,
    version: ApiVersion
  ) {
    this.metrics.trackRequest(version, "chaining");
    return this.branching.execute(from, to, date);
  }

  // Microservices Client methods
  // Flights
  async getFlights(from?: string, to?: string, date?: string) {
    return this.httpClient.call(`${SERVICE_URL.flights}/flights`, {
      from,
      to,
      date,
    });
  }

  async getCheapestFlight(from: string, to: string, date?: string) {
    return this.httpClient.call(`${SERVICE_URL.flights}/flights/cheapest`, {
      from,
      to,
      date,
    });
  }

  // Hotels
  async getHotels(destination: string, date: string, lateCheckIn?: string) {
    return this.httpClient.call(`${SERVICE_URL.hotels}/hotels`, {
      destination,
      date,
      lateCheckIn,
    });
  }
  async getCheapestHotel(destination: string, lateCheckIn?: string) {
    return this.httpClient.call(`${SERVICE_URL.hotels}/hotels/cheapest`, {
      destination,
      lateCheckIn,
    });
  }

  // Weather
  async getWeather(destination: string, date: string) {
    return this.httpClient.call(`${SERVICE_URL.weather}/weather`, {
      destination,
      date,
    });
  }

  // Events
  async getEvents(
    destination: string,
    date?: string,
    category: string = "beach"
  ) {
    return this.httpClient.call(`${SERVICE_URL.events}/events`, {
      destination,
      date,
      category,
    });
  }
}
