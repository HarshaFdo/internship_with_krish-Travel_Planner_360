"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let ClientsService = class ClientsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.FLIGHT_SERVICE_URL = "http://localhost:3001";
        this.HOTEL_SERVICE_URL = "http://localhost:3002";
        this.EVENTS_SERVICE_URL = "http://localhost:3003";
        this.WEATHER_SERVICE_URL = "http://localhost:3004";
    }
    async getFlights(from, to, date) {
        const url = `${this.FLIGHT_SERVICE_URL}/flights`;
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
            params: { from, to, date },
        }));
        return response.data;
    }
    async getCheapestFlight(from, to, date) {
        const url = `${this.FLIGHT_SERVICE_URL}/flights/cheapest`;
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
            params: { from, to, date },
        }));
        return response.data;
    }
    async getHotels(destination, date, lateCheckIn) {
        const url = `${this.HOTEL_SERVICE_URL}/hotels`;
        const params = { destination, date };
        if (lateCheckIn !== undefined) {
            params.lateCheckIn = lateCheckIn?.toString();
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
        return response.data;
    }
    async getCheapestHotel(destination, lateCheckIn) {
        const url = `${this.HOTEL_SERVICE_URL}/hotels/cheapest`;
        const params = { destination };
        if (lateCheckIn !== undefined) {
            params.lateCheckIn = lateCheckIn?.toString();
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
        return response.data;
    }
    async getWeather(destination, date) {
        const url = `${this.WEATHER_SERVICE_URL}/weather`;
        const params = { destination, date };
        if (date) {
            params.date = date;
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
        return response.data;
    }
    async getEvents(destination, date) {
        const url = `${this.EVENTS_SERVICE_URL}/events`;
        const params = { destination };
        if (date) {
            params.date = date;
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params }));
        return response.data;
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ClientsService);
//# sourceMappingURL=HttpClientService.js.map