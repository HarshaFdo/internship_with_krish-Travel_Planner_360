require('dotenv').config();

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
    method: HttpMethod,
    endpoint: string,
    body?: any,
    queries?: Record<string, any>
  ): Promise<any> {
    // Filter the undefined values to avoid sending them as query parameters.
    const cleanQuery = queries
      ? Object.fromEntries(
          Object.entries(queries).filter(([_, v]) => v !== undefined)
        )
      : undefined;

    try {
      let response;

      if (["GET", "DELETE","POST", "PUT", "PATCH"].includes(method)) {
        response = await firstValueFrom(
          this.httpService.request({
            method,
            url: endpoint,
            data: body,
            params: cleanQuery,
          })
        );
      } else {
        throw new BadRequestException(`Unsupported HTTP method: ${method}`);
      }
      
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
