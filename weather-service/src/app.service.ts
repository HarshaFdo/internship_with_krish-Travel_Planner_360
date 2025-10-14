import { Injectable } from "@nestjs/common";
import { WEATHER_DATA } from "./data/weather.data";

@Injectable()
export class AppService {
  private weather = WEATHER_DATA;

  async getWeather(destination: string, date: string) {
    // Failure injection
    const delayMs = parseInt(process.env.WEATHER_DELAY_MS || "0", 10);
    const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || "0");

    //Simulate delay
    if (delayMs > 0) {
      await this.delay(delayMs);
    }

    // Simulate random failure
    if (failRate > 0 && Math.random() < failRate) {
      throw new Error("Weather service temporily unavailable.");
    }

    let result = this.weather.find(
      (w) => w.destination.toLowerCase() === destination.toLowerCase()
    );

    if (!result) {
      return {
        error: "Weather data is not availabe for your specified destination.",
        destination,
      };
    }

    if (date) {
      const dayForecast = result.forecast.find((f) => f.date === date);
      if (dayForecast) {
        return {
          destination: result.destination,
          forecast: [dayForecast],
        };
      }
    }

    // Return 7-day forecast
    return {
      destination: result.destination,
      forecast: result.forecast,
    };
  }

  getHealthy() {
    return {
      service: "Weather Service",
      status: "OK",
      timestamp: new Date().toISOString(),
      config: {
        delayMs: process.env.WEATHER_DELAY_MS || "0",
        failRate: process.env.WEATHER_FAIL_RATE || "0",
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
