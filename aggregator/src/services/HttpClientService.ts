import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ClientsService {
  private readonly FLIGHT_SERVICE_URL = "http://localhost:3001";
  private readonly HOTEL_SERVICE_URL = "http://localhost:3002";
  private readonly EVENTS_SERVICE_URL = "http://localhost:3003";
  private readonly WEATHER_SERVICE_URL = "http://localhost:3004";
  

  constructor(private readonly httpService: HttpService) {}

  async getFlights(from?: string, to?: string, date?: string) {
    const url = `${this.FLIGHT_SERVICE_URL}/flights`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        params: { from, to, date },
      })
    );
    return response.data;
  }

  async getCheapestFlight(from: string, to: string, date?: string) {
    const url = `${this.FLIGHT_SERVICE_URL}/flights/cheapest`;
    const response = await firstValueFrom(
      this.httpService.get(url, {
        params: { from, to, date },
      })
    );
    return response.data;
  }

  async getHotels(destination: string, date: string, lateCheckIn?: string) {
    const url = `${this.HOTEL_SERVICE_URL}/hotels`;
    const params: any = { destination, date };

    if (lateCheckIn !== undefined) {
      params.lateCheckIn = lateCheckIn?.toString();
    }

    const response = await firstValueFrom(
      this.httpService.get(url, { params })
    );
    return response.data;
  }

  async getCheapestHotel(destination: string, lateCheckIn?: string) {
    const url = `${this.HOTEL_SERVICE_URL}/hotels/cheapest`;
    const params: any = { destination };

    if (lateCheckIn !== undefined) {
      params.lateCheckIn = lateCheckIn?.toString();
    }

    const response = await firstValueFrom(
      this.httpService.get(url, { params })
    );
    return response.data;
  }

  async getWeather(destination: string, date: string) {
    const url = `${this.WEATHER_SERVICE_URL}/weather`;
    const params: any = { destination, date };

    if (date) {
      params.date = date;
    }

    const response = await firstValueFrom(
      this.httpService.get(url, { params })
    );
    return response.data;
  }

  async getEvents(destination: string, date: string) {
    const url = `${this.EVENTS_SERVICE_URL}/events`;
    const params: any = { destination };

    if (date) {
      params.date = date;
    }

    const response = await firstValueFrom(
      this.httpService.get(url, { params })
    );
    return response.data;
  }
}
