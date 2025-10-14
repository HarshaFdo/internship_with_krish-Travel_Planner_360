import { Injectable } from "@nestjs/common";
import { HOTELS_DATA } from "./data/hostels.data";

@Injectable()
export class AppService {
  private hostels = HOTELS_DATA;

  getHotels(destination?: string, date?: string, lateCheckIn?: string) {
    let results = [...this.hostels];

    if (destination) {
      results = results.filter(
        (hotel) => hotel.destination.toLowerCase() === destination.toLowerCase()
      );
    }

    if (lateCheckIn === "true") {
      results = results.filter((hotel) => hotel.lateCheckIn === true);
    }

    return {
      hotels: results,
      metadata: {
        total: results.length,
        destination: destination || "any",
        date: date || "any",
        lateCheckInOnly: lateCheckIn === "true",
      },
    };
  }

  getCheapestHotel(destination: string, lateCheckIn?: boolean) {
    let filtered = this.hostels.filter(
      (hotel) => hotel.destination.toLowerCase() === destination.toLowerCase(),
    );

    if (lateCheckIn) {
      filtered = filtered.filter((hotel) => hotel.lateCheckIn === true);
    }

    if (filtered.length === 0) {
      return null;
    }

    const cheapest = filtered.reduce((prev, current) =>
      prev.pricePerNight < current.pricePerNight ? prev : current
    );

    return cheapest;
  }


  getHeathy() {
    return {
      service: "Hotel Service",
      status: "OK",
      timestamp: new Date().toISOString(),
      totalHotels: this.hostels.length,
    };
}
}
