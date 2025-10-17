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
var TripsV2Controller_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsV2Controller = void 0;
const common_1 = require("@nestjs/common");
const scatter_gather_service_1 = require("../services/patterns/scatter-gather.service");
const HttpClientService_1 = require("../services/HttpClientService");
const metrics_service_1 = require("../services/metrics.service");
const circuit_breaker_service_1 = require("../services/circuit-breaker.service");
let TripsV2Controller = TripsV2Controller_1 = class TripsV2Controller {
    constructor(scatterGatherService, clientsService, metricsService, circuitBreakerService) {
        this.scatterGatherService = scatterGatherService;
        this.clientsService = clientsService;
        this.metricsService = metricsService;
        this.circuitBreakerService = circuitBreakerService;
        this.logger = new common_1.Logger(TripsV2Controller_1.name);
    }
    // for scatter-gather pattern
    async search(from, to, date) {
        if (!from || !to || !date) {
            throw new common_1.BadRequestException("Missing required query parameters: from, to, date");
        }
        this.metricsService.trackRequest("v2", "/v2/trips/search");
        const v1Response = await this.scatterGatherService.execute(from, to, date);
        this.logger.log(`[V2] /search called with from=${from}, to=${to}, date=${date}`);
        //  circuit breaker for weather service
        const weather = await this.circuitBreakerService.execute(() => this.clientsService.getWeather(to, date), () => ({
            summary: "unavailable",
            degraded: true,
            error: "Weather service temporarily unavailable",
        }), "weather-service");
        return {
            ...v1Response,
            weather,
            version: "v2",
        };
    }
};
exports.TripsV2Controller = TripsV2Controller;
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("from")),
    __param(1, (0, common_1.Query)("to")),
    __param(2, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TripsV2Controller.prototype, "search", null);
exports.TripsV2Controller = TripsV2Controller = TripsV2Controller_1 = __decorate([
    (0, common_1.Controller)("v2/trips"),
    __metadata("design:paramtypes", [scatter_gather_service_1.ScatterGatherService,
        HttpClientService_1.ClientsService,
        metrics_service_1.MetricsService,
        circuit_breaker_service_1.CircuitBreakerService])
], TripsV2Controller);
//# sourceMappingURL=trips.v2.controller.js.map