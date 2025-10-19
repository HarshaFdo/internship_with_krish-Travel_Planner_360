import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HttpClients {
  private readonly logger = new Logger(HttpClients.name);

  // take this from .env
  private readonly SERVICE_URL = {
    flights: process.env.WEATHER_SERVICE_URL,
    hotels: process.env.HOTELS_SERVICE_URL,
    events: process.env.EVENTS_SERVICE_URL,
    weather: process.env.WEATHER_SERVICE_URL,
  } as const;

  constructor(private readonly httpService: HttpService) {}
  // only call method
  async call(
    endpoint: string,
    // body: any,
    // queries?: Record<string,any>,
    params?: Record<string, any>
  ): Promise<any> {
    // Filter the undefined values to avoid sending them as query parameters.
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        )
      : undefined;

    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint, { params: cleanParams })
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error fetching from ${endpoint}${endpoint}: ${message}`
      );
      throw new InternalServerErrorException(
        `Failed to fetch from ${endpoint} service`
      );
    }
  }

  async getFlights(from?: string, to?: string, date?: string) {
    return this.call(`${this.SERVICE_URL.flights}, /flights`, {
      from,
      to,
      date,
    });
  }

  async getCheapestFlight(from: string, to: string, date?: string) {
    return this.call(`${this.SERVICE_URL.flights}/flights/cheapest`, {
      from,
      to,
      date,
    });
  }

  async getHotels(destination: string, date: string, lateCheckIn?: string) {
    return this.call(`${this.SERVICE_URL.hotels}/hotels`, {
      destination,
      date,
      lateCheckIn,
    });
  }
  async getCheapestHotel(destination: string, lateCheckIn?: string) {
    return this.call(`${this.SERVICE_URL.hotels}/hotels/cheapest`, {
      destination,
      lateCheckIn,
    });
  }

  async getWeather(destination: string, date: string) {
    return this.call(`${this.SERVICE_URL.weather}/weather`, {
      destination,
      date,
    });
  }

  async getEvents(
    destination: string,
    date?: string,
    category: string = "beach"
  ) {
    return this.call(`${this.SERVICE_URL.events}/events`, {
      destination,
      date,
      category,
    });
  }
}
