import { Injectable } from "@nestjs/common";
import { EVENTS_DATA } from "./data/events.data";
import { SearchEventsDto } from "./dto/search-events.dto";

@Injectable()
export class AppService {
  private events = EVENTS_DATA;

  getEvents(query: SearchEventsDto ) {
    let results = [...this.events];

    if (query.destination) {
      results = results.filter(
        (event) => event.destination.toLowerCase() === query.destination.toLowerCase()
      );
    }

    if (query.date) {
      results = results.filter((event) => event.date === query.date);
    }

    if (query.category) {
      results = results.filter(
        (event) => event.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    return {
      events: results,
      metadata: {
        total: results.length,
        destination: query.destination || "any",
        date: query.date || "any",
        category: query.category || "any",
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
