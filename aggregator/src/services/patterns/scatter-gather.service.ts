import { Injectable, Logger } from "@nestjs/common";
import { ClientsService } from "../HttpClient.service";

@Injectable()
export class ScatterGatherService {
  private readonly logger = new Logger(ScatterGatherService.name);
  private readonly TIMEOUT_MS = 1000;

  constructor(private readonly clientsService: ClientsService) {}

  async execute(from: string, to: string, date: string) {
    const startTime = Date.now();
    this.logger.log(
      `[Scatter-Gather] is starting parallel calles for ${from} -> ${to} on ${date} `
    );

    const flightPromise = this.clientsService
      .getFlights(from, to, date)
      .then((data) => ({ data, service: "flight", success: true }))
      .catch((error) => ({
        data: null,
        service: "flight",
        success: false,
        error: error.message,
      }));

    const hotelPromise = this.clientsService
      .getHotels(to, date)
      .then((data) => ({ data, service: "hotel", success: true }))
      .catch((error) => ({
        data: null,
        service: "hotel",
        success: false,
        error: error.message,
      }));

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ timeout: true });
      }, this.TIMEOUT_MS);
    });

    const results = await Promise.race([
      Promise.allSettled([flightPromise, hotelPromise]),
      timeoutPromise,
    ]);

    const elapsedTime = Date.now() - startTime;

    if (results && typeof results === "object" && "timeout" in results) {
      this.logger.warn(
        `[Scatter-Gather] Timeout occurred after ${this.TIMEOUT_MS} ms - returning partial results`
      );

      const partialResults = await Promise.allSettled([
        flightPromise,
        hotelPromise,
      ]);

      return this.buildResponse(partialResults, elapsedTime, true);
    }

    this.logger.log(`[Scatter-Gather] Completed in ${elapsedTime} ms`);
    return this.buildResponse(results as any, elapsedTime, false);
  }

  private buildResponse(
    results: any[],
    elapsedTime: number,
    isTimeout: boolean
  ) {
    const response: any = {
      flights: null,
      hotels: null,
      degraded: false,
      metadata: {
        pattern: "scatter-gather",
        elapsedTimeMs: elapsedTime,
        timeout: isTimeout,
      },
    };

    const flightResult = results[0];
    if (flightResult.status === "fulfilled" && flightResult.value.success) {
      response.flights = flightResult.value.data.flights || [];
    } else {
      response.degraded = true;
      response.metadata.flightError =
        flightResult.value?.error || "Flight service failed";
      this.logger.error(
        `[Scatter-Gather] Flight service error: ${response.metadata.flightError}`
      );
    }

    const hotelResult = results[1];
    if (hotelResult.status === "fulfilled" && hotelResult.value.success) {
      response.hotels = hotelResult.value.data.hotels || [];
    } else {
      response.degraded = true;
      response.metadata.hotelError =
        hotelResult.value?.error || "Hotel service failed";
      this.logger.error(
        `[Scatter-Gather] Hotel service error: ${response.metadata.hotelError}`
      );
    }

    if (response.degraded) {
      this.logger.warn(
        `[Scatter-Gather] Response is degraded - flights: ${response.flights}, hotels: ${response.hotels}`
      );
    } else {
      this.logger.log(
        `[Scatter-Gather] Success - ${response.flights.length || 0} flights, ${response.hotels.length || 0} hotels`
      );
    }
    return response;
  }
}
