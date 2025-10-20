import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export const SERVICE_URL = {
  flights: process.env.FLIGHTS_SERVICE_URL,
  hotels: process.env.HOTELS_SERVICE_URL,
  events: process.env.EVENTS_SERVICE_URL,
  weather: process.env.WEATHER_SERVICE_URL,
} as const;

export type ServiceName = keyof typeof SERVICE_URL;

@Injectable()
export class HttpClient {
  private readonly logger = new Logger(HttpClient.name);

  constructor(private readonly httpService: HttpService) {}
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
      this.logger.error(`Error fetching from ${endpoint}: ${message}`);
      throw new InternalServerErrorException(
        `Failed to fetch from ${endpoint} service`
      );
    }
  }
}
