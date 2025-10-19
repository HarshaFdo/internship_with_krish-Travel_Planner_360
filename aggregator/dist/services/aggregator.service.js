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
    constructor(scatterGather, chaining, branching, circuitBreaker, httpClients) {
        this.scatterGather = scatterGather;
        this.chaining = chaining;
        this.branching = branching;
        this.circuitBreaker = circuitBreaker;
        this.httpClients = httpClients;
        this.logger = new common_1.Logger(AggregatorService_1.name);
        this.metrics = {
            v1Requests: 0,
            v2Requests: 0,
            startTime: new Date(),
        };
    }
    // Metrics methods
    trackRequest(version, endpoint) {
        const key = version === "v1" ? "v1Requests" : "v2Requests";
        this.metrics[key]++;
        this.logger.log(`[Metrics] ${version.toUpperCase()} request to ${endpoint} | Total ${version.toUpperCase()} requests: ${this.metrics[key]}`);
    }
    getMetrics() {
        const { v1Requests, v2Requests } = this.metrics;
        const total = v1Requests + v2Requests;
        const calcPercentage = (count) => total ? ((count / total) * 100).toFixed(2) + "%" : "0.00%";
        return {
            v1Requests,
            v2Requests,
            totalRequests: total,
            v1Percentage: calcPercentage(v1Requests),
            v2Percentage: calcPercentage(v2Requests),
            uptime: this.getUptime(),
        };
    }
    getUptime() {
        const now = new Date();
        const difference = now.getTime() - this.metrics.startTime.getTime();
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
    // weather service with circuit breaker
    async fetchWeatherWithCircuitBreaker(destination, date) {
        this.logger.log(`[AggregatorService] Fetching weather for ${destination} on ${date}`);
        try {
            const weather = await this.circuitBreaker.execute(() => this.httpClients.getWeather(destination, date), () => ({
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
    // TODO: Add aggregator pattern methods here later
    async executeScatterGather(from, to, date, includeWeather = false) {
        const respone = await this.scatterGather.execute(from, to, date);
        if (includeWeather) {
            const weather = await this.fetchWeatherWithCircuitBreaker(to, date);
            respone.weather = weather;
            if (weather.degraded) {
                respone.degraded = true;
                respone.metadata.weatherError = weather.error;
            }
        }
        return respone;
    }
    async executeChaining(from, to, date) {
        return this.chaining.execute(from, to, date);
    }
    async executeBranching(from, to, date) {
        return this.branching.execute(from, to, date);
    }
};
exports.AggregatorService = AggregatorService;
exports.AggregatorService = AggregatorService = AggregatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scatter_gather_1.ScatterGather,
        chaining_1.Chaining,
        branching_1.Branching,
        circuit_breaker_1.CircuitBreaker,
        HttpClient_1.HttpClients])
], AggregatorService);
//# sourceMappingURL=aggregator.service.js.map