import { Injectable } from "@nestjs/common";
import { FLIGHTS_DATA } from "./data/flights.data";

@Injectable()
export class AppService {
  private flights = FLIGHTS_DATA;

  getFlights(from?: string, to?: string, date?: string) {
    let results = [...this.flights];

    if (from) {
      results = results.filter(
        (flight) => flight.from.toLocaleLowerCase() === from.toLocaleLowerCase()
      );
    }

    if (to) {
      results = results.filter(
        (flight) => flight.to.toLocaleLowerCase() === to.toLocaleLowerCase()
      );
    }

    if (date) {
      results = results.filter((flight) => flight.date === date);
    }

    return {
      flights: results,
      metadata: {
        total: results.length,
        from: from || "any",
        to: to || "any",
        date: date || "any",
      },
    };
  }

  getCheapestFlight(from: string, to: string, date?: string) {
    let filtered = this.flights.filter(
      (flight) =>
        flight.from.toLocaleLowerCase() === from.toLocaleLowerCase() &&
        flight.to.toLocaleLowerCase() === to.toLocaleLowerCase()
    );

    if (date) {
      filtered = filtered.filter((flight) => flight.date === date);
    }

    if (filtered.length === 0) {
      return null;
    }

    const cheapest = filtered.reduce((prev, current) =>
      prev.price < current.price ? prev : current
    );

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
