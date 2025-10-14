"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const weather_data_1 = require("./data/weather.data");
let AppService = class AppService {
    constructor() {
        this.weather = weather_data_1.WEATHER_DATA;
    }
    async getWeather(destination, date) {
        // Failure injection
        const delayMs = parseInt(process.env.WEATHER_DELAY_MS || "0", 10);
        const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || "0");
        //Simulate delay
        if (delayMs > 0) {
            await this.delay(delayMs);
        }
        // Simulate random failure
        if (failRate > 0 && Math.random() < failRate) {
            throw new Error("Weather service temporily unavailable.");
        }
        let result = this.weather.find((w) => w.destination.toLowerCase() === destination.toLowerCase());
        if (!result) {
            return {
                error: "Weather data is not availabe for your specified destination.",
                destination,
            };
        }
        if (date) {
            const dayForecast = result.forecast.find((f) => f.date === date);
            if (dayForecast) {
                return {
                    destination: result.destination,
                    forecast: [dayForecast],
                };
            }
        }
        // Return 7-day forecast
        return {
            destination: result.destination,
            forecast: result.forecast,
        };
    }
    getHealthy() {
        return {
            service: "Weather Service",
            status: "OK",
            timestamp: new Date().toISOString(),
            config: {
                delayMs: process.env.WEATHER_DELAY_MS || "0",
                failRate: process.env.WEATHER_FAIL_RATE || "0",
            },
        };
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map