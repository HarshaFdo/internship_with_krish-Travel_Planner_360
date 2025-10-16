import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { WEATHER_DATA } from "./data/weather.data";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private weather = WEATHER_DATA;
  private serviceDelayDuration: number;
  private originalDelay: number;

  constructor() {
    this.serviceDelayDuration = parseInt(
      process.env.WEATHER_DELAY_MS || "0",
      10
    );
    this.originalDelay = this.serviceDelayDuration;

    this.logger.log(
      `Weather service initialized with delay=${this.serviceDelayDuration}ms`
    );
  }

  async getWeather(destination: string, date: string) {
    try {
      // Check for failures
      await this.simulateFailureInjection();

      // Search for destination
      let result = this.weather.find(
        (w) => w.destination.toLowerCase() === destination.toLowerCase()
      );

      if (!result) {
        throw new NotFoundException({
          message:
            "Weather data is not availabe for your specified destination.",
          destination,
        });
      }

      // If date specified then find specific day forecast
      if (date) {
        const dayForecast = result.forecast.find((f) => f.date === date);
        if (dayForecast) {
          return {
            destination: result.destination,
            forecast: [dayForecast],
          };
        }
      }

      // Return 7-day forecast if no date or date not found
      return {
        destination: result.destination,
        forecast: result.forecast,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new ServiceUnavailableException({
          message:
            error instanceof Error
              ? error.message
              : "Weather service temporily unavailable",
        });
      }
    }
  }

  private async simulateFailureInjection(): Promise<void> {
    const delayMs = this.getDelay();
    const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || "0");

    // Simulate delay
    if (delayMs > 0) {
      this.logger.debug(`Simulating service delay of ${delayMs}ms`);
      try {
        await this.delay(delayMs);
      } catch (error) {
        throw new InternalServerErrorException(
          "Failed during delay simulation"
        );
      }

      // Simulate random failure
      if (failRate > 0 && Math.random() < failRate) {
        throw new ServiceUnavailableException(
          "Weather service temporarily unavailable."
        );
      }
    }
  }

  getDelay(): number {
    return this.serviceDelayDuration;
  }

  // Update delay dynamically
  updateDelay(delayMs: number) {
    this.serviceDelayDuration = delayMs;
    return {
      message: "Delay updated successfully",
      newDelay: this.serviceDelayDuration,
      unit: "milliseconds",
    };
  }

  // Reset the delay to orginal one
  resetDelay() {
    this.serviceDelayDuration = this.originalDelay;
    this.logger.log(`Delay reset to original value: ${this.originalDelay}ms`);
    return {
      message: "Delay reset to original value",
      delay: this.serviceDelayDuration,
      unit: "milliseconds",
    };
  }

  getHealthy() {
    return {
      service: "Weather Service",
      status: "OK",
      timestamp: new Date().toISOString(),
      config: {
        delayMs: this.getDelay(),
        failRate: process.env.WEATHER_FAIL_RATE || "0",
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
