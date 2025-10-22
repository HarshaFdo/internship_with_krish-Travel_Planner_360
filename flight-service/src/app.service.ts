import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FLIGHTS_DATA } from "./data/flights.data";
import { SearchFlightDto } from "./dto/search-flights.dto";
import { GetCheapestFlightDto } from "./dto/get-cheapest-flight.dto";

@Injectable()
export class AppService {
  private flights = FLIGHTS_DATA;
  private readonly logger = new Logger(AppService.name);

  getFlights(query: SearchFlightDto) {
    let results = [...this.flights];

    if (query.from) {
      results = results.filter(
        (flight) => flight.from.toLocaleLowerCase() === query.from!.toLocaleLowerCase()
      );
    }

    if (query.to) {
      results = results.filter(
        (flight) => flight.to.toLocaleLowerCase() === query.to!.toLocaleLowerCase()
      );
    }

    if (query.date) {
      results = results.filter((flight) => flight.date === query.date);
    }

    this.logger.log(`Returning ${results.length} flights`);
    return {
      flights: results,
      metadata: {
        total: results.length,
        from: query.from || "any",
        to: query.to || "any",
        date: query.date || "any",
      },
    };
  }

  getCheapestFlight(query: GetCheapestFlightDto) {
    console.log("getCheapestFlight")
    // setTimeout(() => {
    //   console.log("set interval executed")
    // }, 6500);
 
    let filtered = this.flights.filter(
      (flight) =>
        flight.from.toLocaleLowerCase() === query.from.toLocaleLowerCase() &&
        flight.to.toLocaleLowerCase() === query.to.toLocaleLowerCase()
    );

    if (query.date) {
      filtered = filtered.filter((flight) => flight.date === query.date);
    }

    if (filtered.length === 0) {
      throw new NotFoundException({
        message: "No flights found for the specified route.",
        from: query.from,
        to: query.to,
        date: query.date || "any",
      });
    }

    const cheapest = filtered.reduce((prev, current) =>
      prev.price < current.price ? prev : current
    );

    this.logger.log(`Cheapest flight found: ${cheapest.from} at $${cheapest.price}`);
    return cheapest;
  }

  isLateArrival(arriveTime: string): boolean {
    const [hours] = arriveTime.split(":").map(Number);
    return hours >= 18;
  }

  getHealthy() {
    return {
      service: "Flight Service",
      status: "OK",
      timestamp: new Date().toISOString(),
      totalFights: this.flights.length,
    };
  }
}
