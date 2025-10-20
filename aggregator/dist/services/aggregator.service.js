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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AggregatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorService = void 0;
const common_1 = require("@nestjs/common");
const scatter_gather_1 = require("../utils/scatter-gather");
const chaining_1 = require("../utils/chaining");
const branching_1 = require("../utils/branching");
const circuit_breaker_1 = require("../utils/circuit-breaker");
const HttpClient_1 = require("../utils/HttpClient");
let AggregatorService = AggregatorService_1 = class AggregatorService {
    constructor(scatterGather, chaining, branching, circuitBreaker, httpClient) {
        this.scatterGather = scatterGather;
        this.chaining = chaining;
        this.branching = branching;
        this.circuitBreaker = circuitBreaker;
        this.httpClient = httpClient;
        this.logger = new common_1.Logger(AggregatorService_1.name);
    }
    // weather service with circuit breaker
    async fetchWeatherWithCircuitBreaker(destination, date) {
        this.logger.log(`[AggregatorService] Fetching weather for ${destination} on ${date}`);
        try {
            const weather = await this.circuitBreaker.execute(() => this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.weather}/weather`, null, {
                destination,
                date,
            }), () => ({
                destination,
                forecast: [],
                degraded: true,
                error: "Weather service temporarily unavailable",
            }), "weather-service");
            if (weather.degraded) {
                this.logger.warn(`[AggregatorService] Weather service degraded`);
            }
            else {
                this.logger.log(`[AggregatorService] Weather fetched successfully for ${weather.destination}`);
            }
            return weather;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            this.logger.error(`[AggregatorService] Weather circuit breaker error: ${errorMessage}`);
            return {
                destination,
                forecast: [],
                degraded: true,
                error: "Weather service unavailable",
            };
        }
    }
    // Aggregator pattern methods
    async executeScatterGather(from, to, date, includeWeather = false) {
        const response = await this.scatterGather.execute(from, to, date);
        if (includeWeather) {
            const weather = await this.fetchWeatherWithCircuitBreaker(to, date);
            response.weather = weather;
            if (weather.degraded) {
                response.degraded = true;
                response.metadata.weatherError = weather.error;
            }
        }
        return response;
    }
    async executeChaining(from, to, date) {
        return this.chaining.execute(from, to, date);
    }
    async executeBranching(from, to, date) {
        return this.branching.execute(from, to, date);
    }
    // Microservices Client methods
    // Flights
    async getFlights(from, to, date) {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.flights}/flights`, null, {
            from,
            to,
            date,
        });
    }
    async getCheapestFlight(from, to, date) {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.flights}/flights/cheapest`, null, {
            from,
            to,
            date,
        });
    }
    // Hotels
    async getHotels(destination, date, lateCheckIn) {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.hotels}/hotels`, null, {
            destination,
            date,
            lateCheckIn,
        });
    }
    async getCheapestHotel(destination, lateCheckIn) {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.hotels}/hotels/cheapest`, null, {
            destination,
            lateCheckIn,
        });
    }
    // Weather
    async getWeather(destination, date) {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.weather}/weather`, null, {
            destination,
            date,
        });
    }
    // Events
    async getEvents(destination, date, category = "beach") {
        return this.httpClient.call("GET", `${HttpClient_1.SERVICE_URL.events}/events`, null, {
            destination,
            date,
            category,
        });
    }
};
exports.AggregatorService = AggregatorService;
exports.AggregatorService = AggregatorService = AggregatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chaining_1.Chaining))),
    __metadata("design:paramtypes", [scatter_gather_1.ScatterGather,
        chaining_1.Chaining,
        branching_1.Branching,
        circuit_breaker_1.CircuitBreaker,
        HttpClient_1.HttpClient])
], AggregatorService);
//# sourceMappingURL=aggregator.service.js.map