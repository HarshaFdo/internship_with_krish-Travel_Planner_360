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
const HttpClientService_1 = require("../HttpClientService");
let ScatterGatherService = ScatterGatherService_1 = class ScatterGatherService {
    constructor(clientsService) {
        this.clientsService = clientsService;
        this.logger = new common_1.Logger(ScatterGatherService_1.name);
        this.TIMEOUT_MS = 1000;
    }
    async execute(from, to, date) {
        const startTime = Date.now();
        this.logger.log(`[Scatter-Gather] is starting parallel calles for ${from} -> ${to} on ${date} `);
        const flightPromise = this.clientsService
            .getFlights(from, to, date)
            .then((data) => ({ data, service: "flight", success: true }))
            .catch((error) => ({
            data: null,
            service: "flight",
            success: false,
            error: error.message,
        }));
        const hotelPromise = this.clientsService
            .getHotels(to, date)
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
        if (results && typeof results === "object" && "timeout" in results) {
            this.logger.warn(`[Scatter-Gather] Timeout occurred after ${this.TIMEOUT_MS} ms - returning partial results`);
            const partialResults = await Promise.allSettled([
                flightPromise,
                hotelPromise,
            ]);
            return this.buildResponse(partialResults, elapsedTime, true);
        }
        this.logger.log(`[Scatter-Gather] Completed in ${elapsedTime} ms`);
        return this.buildResponse(results, elapsedTime, false);
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
    __metadata("design:paramtypes", [HttpClientService_1.ClientsService])
], ScatterGatherService);
//# sourceMappingURL=scatter-gather.service.js.map