import { Injectable, Logger } from "@nestjs/common";
import { ClientsService } from "../clients.service";
import { isCoastalDestination } from "../../utils/location-utils";

@Injectable()
export class BranchingService {
  private readonly logger = new Logger(BranchingService.name);

  constructor(private readonly clientsService: ClientsService) {}

  async execute(from: string, to: string, date: string) {
    const startTime = Date.now();

    const isCoastal = isCoastalDestination(to);
    const destinationType = isCoastal ? "coastal" : "inland";

    this.logger.log(
      `[Branching] Starting orchestration for ${from} -> ${to} on ${date}`
    );

    const elapsedTime = Date.now() - startTime;

    try {
      // always we have to fetch flight and hotels in parallel(scatter-gather)
      this.logger.log(`[Branching] Fetching flights and hotels in parallel...`);

      const [flightResponse, hotelResponse] = await Promise.allSettled([
        this.clientsService.getFlights(from, to, date),
        this.clientsService.getHotels(to, date),
      ]);

      const response: any = {
        flights:
          flightResponse.status === "fulfilled"
            ? flightResponse.value.flights || []
            : [],
        hotels:
          hotelResponse.status === "fulfilled"
            ? hotelResponse.value.hotels || []
            : [],
      };

      //based on the destination(coastal/inland) we have to fetch the activities
      if (isCoastal) {
        this.logger.log(
          `[Branching] Destination is Coastal - fetching events for ${to}...`
        );

        const eventResponse = await this.clientsService.getEvents(to, date);
        response.events = eventResponse.events || [];

        this.logger.log(
          `[Branching] Fetched the events - ${response.events.length} events that found.`
        );
      } else {
        this.logger.log(
          `[Branching] Destination is Inland - skiping the events service`
        );
      }

      response.metadata = {
        pattern: "Branching",
        destinationType: destinationType,
        eventsIncluded: isCoastal,
        elapsedTimeMs: elapsedTime,
        counts: {
          flights: response.flights.length,
          hotels: response.hotels.length,
          events: response.events?.length || 0,
        },
      };

      this.logger.log(
        `[Branching] completed in ${elapsedTime} ms - 
        Flights: ${response.metadata.counts.flights}, 
        Hotels: ${response.metadata.counts.hotels}, 
        Events: ${response.metadata.counts.events}`
      );

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(`[Branching] Error that occurred: ${errorMessage}`);

      return {
        error: errorMessage,
        metadata: {
          pattern: "Branching",
          destinationType: destinationType,
          elapsedTimeMs: elapsedTime,
        },
      };
    }
  }
}
