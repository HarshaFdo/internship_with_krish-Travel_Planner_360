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
var HttpClientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClientsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let HttpClientsService = HttpClientsService_1 = class HttpClientsService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(HttpClientsService_1.name);
        this.SERVICE_URL = {
            flights: "http://localhost:3001",
            hotels: "http://localhost:3002",
            events: "http://localhost:3003",
            weather: "http://localhost:3004",
        };
    }
    async fetchFromService(service, endpoint, params) {
        const url = `${this.SERVICE_URL[service]}${endpoint}`;
        // Filter the undefined values to avoid sending them as query parameters.
        const cleanParams = params
            ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
            : undefined;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { params: cleanParams }));
            return response.data;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error fetching from ${service}${endpoint}: ${message}`);
            throw new common_1.InternalServerErrorException(`Failed to fetch from ${service} service`);
        }
    }
    async getFlights(from, to, date) {
        return this.fetchFromService("flights", "/flights", { from, to, date });
    }
    async getCheapestFlight(from, to, date) {
        return this.fetchFromService("flights", "/flights/cheapest", {
            from,
            to,
            date,
        });
    }
    async getHotels(destination, date, lateCheckIn) {
        return this.fetchFromService("hotels", "/hotels", {
            destination,
            date,
            lateCheckIn,
        });
    }
    async getCheapestHotel(destination, lateCheckIn) {
        return this.fetchFromService("hotels", "/hotels/cheapest", {
            destination,
            lateCheckIn,
        });
    }
    async getWeather(destination, date) {
        return this.fetchFromService("weather", "/weather", { destination, date });
    }
    async getEvents(destination, date) {
        return this.fetchFromService("events", "/events", { destination, date });
    }
};
exports.HttpClientsService = HttpClientsService;
exports.HttpClientsService = HttpClientsService = HttpClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], HttpClientsService);
//# sourceMappingURL=HttpClient.service.js.map