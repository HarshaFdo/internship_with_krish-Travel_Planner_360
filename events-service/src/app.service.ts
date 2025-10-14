import { Injectable } from "@nestjs/common";
import { EVENTS_DATA } from "./data/events.data";

@Injectable()
export class AppService {
  private events = EVENTS_DATA;

  getEvents(destination?: string, date?: string, category?: string ) {
    let results = [...this.events];

    if (destination) {
      results = results.filter(
        (event) => event.destination.toLowerCase() === destination.toLowerCase()
      );
    }

    if (date) {
      results = results.filter((event) => event.date === date);
    }

    if (category) {
      results = results.filter(
        (event) => event.category.toLowerCase() === category.toLowerCase()
      );
    }

    return {
      events: results,
      metadata: {
        total: results.length,
        destination: destination || "any",
        date: date || "any",
        category: category || "any",
      },
    };
  }

  getHealthy() {
    return {
      service: "events-service",
      status: "OK",
      timestamp: new Date().toISOString(),
      totalEvents: this.events.length,
    };
  }
}
