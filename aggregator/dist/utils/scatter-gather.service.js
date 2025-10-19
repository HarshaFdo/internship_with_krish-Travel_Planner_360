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
var ScatterGatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterGatherService = void 0;
const common_1 = require("@nestjs/common");
const HttpClient_1 = require("./HttpClient");
const circuit_breaker_1 = require("./circuit-breaker");
let ScatterGatherService = ScatterGatherService_1 = class ScatterGatherService {
    constructor(HttpClientsService, circuitBreakerService) {
        this.HttpClientsService = HttpClientsService;
        this.circuitBreakerService = circuitBreakerService;
        this.logger = new common_1.Logger(ScatterGatherService_1.name);
        this.TIMEOUT_MS = 1000;
    }
    async execute(from, to, date, includeWeather = false) {
        const startTime = Date.now();
        this.logger.log(`[Scatter-Gather] Starting parallel calls for ${from} -> ${to} on ${date} (includeWeather: ${includeWeather})`);
        const flightPromise = this.HttpClientsService.getFlights(from, to, date)
            .then((data) => ({ data, service: "flight", success: true }))
            .catch((error) => ({
            data: null,
            service: "flight",
            success: false,
            error: error.message,
        }));
        const hotelPromise = this.HttpClientsService.getHotels(to, date)
            .then((data) => ({ data, service: "hotel", success: true }))
            .catch((error) => ({
            data: null,
            service: "hotel",
            success: false,
            error: error.message,
        }));
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve({ timeout: true });
            }, this.TIMEOUT_MS);
        });
        const results = await Promise.race([
            Promise.allSettled([flightPromise, hotelPromise]),
            timeoutPromise,
        ]);
        const elapsedTime = Date.now() - startTime;
        let response;
        if (results && typeof results === "object" && "timeout" in results) {
            this.logger.warn(`[Scatter-Gather] Timeout occurred after ${this.TIMEOUT_MS} ms - returning partial results`);
            const partialResults = await Promise.allSettled([
                flightPromise,
                hotelPromise,
            ]);
            response = this.buildResponse(partialResults, elapsedTime, true);
        }
        else {
            this.logger.log(`[Scatter-Gather] Completed in ${elapsedTime} ms`);
            response = this.buildResponse(results, elapsedTime, false);
        }
        // Add weather response if requested for v2
        if (includeWeather) {
            this.logger.log(`[Scatter-Gather] Fetching weather for ${to} on ${date}`);
            try {
                const weather = await this.circuitBreakerService.execute(() => this.HttpClientsService.getWeather(to, date), () => ({
                    destination: to,
                    forecast: [],
                    degraded: true,
                    error: "Weather service temporarily unavailable",
                }), "weather-service");
                response.weather = weather;
                // State as degraded if weather is failed
                if (weather.degraded) {
                    response.degraded = true;
                    response.metadata.weatherError = weather.error;
                    this.logger.warn(`[Scatter-Gather] Weather service degraded`);
                }
                else {
                    this.logger.log(`[Scatter-Gather] Weather fetched successfully for ${weather.destination}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                this.logger.error(`[Scatter-Gather] Weather circuit breaker error: ${errorMessage}`);
                response.weather = {
                    destination: to,
                    forecast: [],
                    degraded: true,
                    error: "Weather service unavailable",
                };
                response.degraded = true;
                response.metadata.weatherError = errorMessage;
            }
        }
        return response;
    }
    buildResponse(results, elapsedTime, isTimeout) {
        const response = {
            flights: null,
            hotels: null,
            degraded: false,
            metadata: {
                pattern: "scatter-gather",
                elapsedTimeMs: elapsedTime,
                timeout: isTimeout,
            },
        };
        const flightResult = results[0];
        if (flightResult.status === "fulfilled" && flightResult.value.success) {
            response.flights = flightResult.value.data.flights || [];
        }
        else {
            response.degraded = true;
            response.metadata.flightError =
                flightResult.value?.error || "Flight service failed";
            this.logger.error(`[Scatter-Gather] Flight service error: ${response.metadata.flightError}`);
        }
        const hotelResult = results[1];
        if (hotelResult.status === "fulfilled" && hotelResult.value.success) {
            response.hotels = hotelResult.value.data.hotels || [];
        }
        else {
            response.degraded = true;
            response.metadata.hotelError =
                hotelResult.value?.error || "Hotel service failed";
            this.logger.error(`[Scatter-Gather] Hotel service error: ${response.metadata.hotelError}`);
        }
        if (response.degraded) {
            this.logger.warn(`[Scatter-Gather] Response is degraded - flights: ${response.flights}, hotels: ${response.hotels}`);
        }
        else {
            this.logger.log(`[Scatter-Gather] Success - ${response.flights.length || 0} flights, ${response.hotels.length || 0} hotels`);
        }
        return response;
    }
};
exports.ScatterGatherService = ScatterGatherService;
exports.ScatterGatherService = ScatterGatherService = ScatterGatherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [HttpClient_1.HttpClientsService,
        circuit_breaker_1.CircuitBreakerService])
], ScatterGatherService);
//# sourceMappingURL=scatter-gather.service.js.map