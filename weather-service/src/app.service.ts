import { Injectable } from "@nestjs/common";
import { WEATHER_DATA } from "./data/weather.data";

@Injectable()
export class AppService {
  private weather = WEATHER_DATA;
  private dynamicDelay: number | null = null;
  // change this after the start to update delay
  private initialDelay: number = 2000;

  constructor() {
    this.dynamicDelay = 5000;
  }

  private getDelay() {
    return this.dynamicDelay !== null
      ? this.dynamicDelay
      : this.initialDelay || parseInt(process.env.WEATHER_DELAY_MS || "0", 10);
  }

  async getWeather(destination: string, date: string) {
    // Failure injection
    const delayMs = this.getDelay();
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

  updateDelay(delayMs: number) {
    this.dynamicDelay = delayMs;
    return {
      message: "Delay updated successfully",
      newDelay: this.dynamicDelay,
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
