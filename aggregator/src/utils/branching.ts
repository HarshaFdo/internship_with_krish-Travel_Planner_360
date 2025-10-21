import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { isCoastalDestination } from "./location-utils";
import { AggregatorService } from '../services/aggregator.service';

@Injectable()
export class Branching {
  private readonly logger = new Logger(Branching.name);

  constructor(
    @Inject(forwardRef(() => AggregatorService))
    private readonly aggregatorService: AggregatorService) {}

  async execute(from: string, to: string, date: string) {
    const startTime = Date.now();

    const isCoastal = isCoastalDestination(to);
    const destinationType = isCoastal ? "coastal" : "inland";

    this.logger.log(
      `[Branching] Starting orchestration for ${from} -> ${to} on ${date}`
    );

    try {
      // always we have to fetch flight and hotels in parallel(scatter-gather)
      this.logger.log(`[Branching] Fetching flights and hotels in parallel...`);

      // Scatter-Gather
      const [flightResponse, hotelResponse] = await Promise.allSettled([
        this.aggregatorService.getFlights(from, to, date),
        this.aggregatorService.getHotels(to, date),
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

        const eventResponse = await this.aggregatorService.getEvents(to, date);
        response.events = eventResponse.events || [];

        this.logger.log(
          `[Branching] Fetched the events - ${response.events.length} events that found.`
        );
      } else {
        this.logger.log(
          `[Branching] Destination is Inland - skiping the events service`
        );
      }

      const elapsedTime = Date.now() - startTime;

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
      const elapsedTime = Date.now() - startTime;
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
