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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const weather_data_1 = require("./data/weather.data");
let AppService = AppService_1 = class AppService {
    constructor() {
        this.logger = new common_1.Logger(AppService_1.name);
        this.weather = weather_data_1.WEATHER_DATA;
        this.serviceDelayDuration = parseInt(process.env.WEATHER_DELAY_MS || "0", 10);
        this.logger.log(`Weather service initialized with delay=${this.serviceDelayDuration}ms`);
    }
    async getWeather(destination, date) {
        try {
            // Check for failures
            await this.simulateFailureInjection();
            // Search for destination
            let result = this.weather.find((w) => w.destination.toLowerCase() === destination.toLowerCase());
            if (!result) {
                throw new common_1.NotFoundException({
                    message: "Weather data is not availabe for your specified destination.",
                    destination,
                });
            }
            // If date specified then find specific day forecast
            if (date) {
                const dayForecast = result.forecast.find((f) => f.date === date);
                if (dayForecast) {
                    return {
                        destination: result.destination,
                        forecast: [dayForecast],
                    };
                }
            }
            // Return 7-day forecast if no date or date not found
            return {
                destination: result.destination,
                forecast: result.forecast,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.ServiceUnavailableException({
                    message: error instanceof Error ? error.message : "Weather service error",
                });
            }
        }
    }
    async simulateFailureInjection() {
        const delayMs = this.getDelay();
        const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || "0");
        // Simulate delay
        if (delayMs > 0) {
            this.logger.debug(`Simulating service delay of ${delayMs}ms`);
            try {
                await this.delay(delayMs);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException("Failed during delay simulation");
            }
            // Simulate random failure
            if (failRate > 0 && Math.random() < failRate) {
                throw new common_1.ServiceUnavailableException("Weather service temporarily unavailable.");
            }
        }
    }
    getDelay() {
        return this.serviceDelayDuration;
    }
    // Update delay dynamically
    updateDelay(delayMs) {
        this.serviceDelayDuration = delayMs;
        return {
            message: "Delay updated successfully",
            newDelay: this.serviceDelayDuration,
            unit: "milliseconds",
        };
    }
    getHealthy() {
        return {
            service: "Weather Service",
            status: "OK",
            timestamp: new Date().toISOString(),
            config: {
                delayMs: this.getDelay(),
                failRate: process.env.WEATHER_FAIL_RATE || "0",
            },
        };
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map