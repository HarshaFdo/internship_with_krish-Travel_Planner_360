import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ScatterGather } from "../utils/scatter-gather";
import { Chaining } from "../utils/chaining";
import { Branching } from "../utils/branching";
import { CircuitBreaker } from "../utils/circuit-breaker";
import { HttpClient, SERVICE_URL } from "../utils/HttpClient";

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly scatterGather: ScatterGather,
    @Inject(forwardRef(() => Chaining))
    private readonly chaining: Chaining,
    private readonly branching: Branching,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly httpClient: HttpClient
  ) {}

  // weather service with circuit breaker
  async fetchWeatherWithCircuitBreaker(destination: string, date: string) {
    this.logger.log(
      `[AggregatorService] Fetching weather for ${destination} on ${date}`
    );

    try {
      const weather = await this.circuitBreaker.execute(
        () =>
          this.httpClient.call("GET", `${SERVICE_URL.weather}/weather`, null, {
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
    includeWeather: boolean = false
  ) {
    const response = await this.scatterGather.execute(from, to, date);

    if (includeWeather) {
      const weather = await this.fetchWeatherWithCircuitBreaker(to, date);
      response.weather = weather;

      if (weather.degraded) {
        response.degraded = true;
        response.metadata.weatherError = weather.error;
      }
    }

    return response;
  }

  async executeChaining(from: string, to: string, date: string) {
    return this.chaining.execute(from, to, date);
  }

  async executeBranching(from: string, to: string, date: string) {
    return this.branching.execute(from, to, date);
  }

  // Microservices Client methods
  // Flights
  async getFlights(from?: string, to?: string, date?: string) {
    return this.httpClient.call("GET", `${SERVICE_URL.flights}/flights`, null, {
      from,
      to,
      date,
    });
  }

  async getCheapestFlight(from: string, to: string, date?: string) {
    return this.httpClient.call(
      "GET",
      `${SERVICE_URL.flights}/flights/cheapest`,
      null,
      {
        from,
        to,
        date,
      }
    );
  }

  // Hotels
  async getHotels(destination: string, date: string, lateCheckIn?: string) {
    return this.httpClient.call("GET", `${SERVICE_URL.hotels}/hotels`, null, {
      destination,
      date,
      lateCheckIn,
    });
  }
  async getCheapestHotel(destination: string, lateCheckIn?: string) {
    return this.httpClient.call(
      "GET",
      `${SERVICE_URL.hotels}/hotels/cheapest`,
      null,
      {
        destination,
        lateCheckIn,
      }
    );
  }

  // Weather
  async getWeather(destination: string, date: string) {
    return this.httpClient.call("GET", `${SERVICE_URL.weather}/weather`, null, {
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
    return this.httpClient.call("GET", `${SERVICE_URL.events}/events`, null, {
      destination,
      date,
      category,
    });
  }
}
