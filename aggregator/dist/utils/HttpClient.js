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
var HttpClients_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClients = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let HttpClients = HttpClients_1 = class HttpClients {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(HttpClients_1.name);
        // take this from .env
        this.SERVICE_URL = {
            flights: process.env.WEATHER_SERVICE_URL,
            hotels: process.env.HOTELS_SERVICE_URL,
            events: process.env.EVENTS_SERVICE_URL,
            weather: process.env.WEATHER_SERVICE_URL,
        };
    }
    // only call method
    async call(endpoint, 
    // body: any,
    // queries?: Record<string,any>,
    params) {
        // Filter the undefined values to avoid sending them as query parameters.
        const cleanParams = params
            ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
            : undefined;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(endpoint, { params: cleanParams }));
            return response.data;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error fetching from ${endpoint}${endpoint}: ${message}`);
            throw new common_1.InternalServerErrorException(`Failed to fetch from ${endpoint} service`);
        }
    }
    async getFlights(from, to, date) {
        return this.call(`${this.SERVICE_URL.flights}, /flights`, {
            from,
            to,
            date,
        });
    }
    async getCheapestFlight(from, to, date) {
        return this.call(`${this.SERVICE_URL.flights}/flights/cheapest`, {
            from,
            to,
            date,
        });
    }
    async getHotels(destination, date, lateCheckIn) {
        return this.call(`${this.SERVICE_URL.hotels}/hotels`, {
            destination,
            date,
            lateCheckIn,
        });
    }
    async getCheapestHotel(destination, lateCheckIn) {
        return this.call(`${this.SERVICE_URL.hotels}/hotels/cheapest`, {
            destination,
            lateCheckIn,
        });
    }
    async getWeather(destination, date) {
        return this.call(`${this.SERVICE_URL.weather}/weather`, {
            destination,
            date,
        });
    }
    async getEvents(destination, date, category = "beach") {
        return this.call(`${this.SERVICE_URL.events}/events`, {
            destination,
            date,
            category,
        });
    }
};
exports.HttpClients = HttpClients;
exports.HttpClients = HttpClients = HttpClients_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], HttpClients);
//# sourceMappingURL=HttpClient.js.map