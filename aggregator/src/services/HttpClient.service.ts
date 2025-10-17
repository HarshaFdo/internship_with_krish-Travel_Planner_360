import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HttpClientsService {
  private readonly logger = new Logger(HttpClientsService.name);

  private readonly SERVICE_URL = {
    flights: "http://localhost:3001",
    hotels: "http://localhost:3002",
    events: "http://localhost:3003",
    weather: "http://localhost:3004",
  } as const;

  constructor(private readonly httpService: HttpService) {}

  async fetchFromService(
    service: keyof typeof this.SERVICE_URL,
    endpoint: string,
    params?: Record<string, any>
  ): Promise<any> {
    const url = `${this.SERVICE_URL[service]}${endpoint}`;

    // Filter the undefined values to avoid sending them as query parameters.
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        )
      : undefined;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params: cleanParams })
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error fetching from ${service}${endpoint}: ${message}`
      );
      throw new InternalServerErrorException(
        `Failed to fetch from ${service} service`
      );
    }
  }

  async getFlights(from?: string, to?: string, date?: string) {
    return this.fetchFromService("flights", "/flights", { from, to, date });
  }

  async getCheapestFlight(from: string, to: string, date?: string) {
    return this.fetchFromService("flights", "/flights/cheapest", {
      from,
      to,
      date,
    });
  }

  async getHotels(destination: string, date: string, lateCheckIn?: string) {
    return this.fetchFromService("hotels", "/hotels", {
      destination,
      date,
      lateCheckIn,
    });
  }
  async getCheapestHotel(destination: string, lateCheckIn?: string) {
    return this.fetchFromService("hotels", "/hotels/cheapest", {
      destination,
      lateCheckIn,
    });
  }

  async getWeather(destination: string, date: string) {
    return this.fetchFromService("weather", "/weather", { destination, date });
  }

  async getEvents(destination: string, date?: string) {
    return this.fetchFromService("events", "/events", { destination, date });
  }
}
