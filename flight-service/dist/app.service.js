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
const flights_data_1 = require("./data/flights.data");
let AppService = class AppService {
    constructor() {
        this.flights = flights_data_1.FLIGHTS_DATA;
    }
    getFlights(from, to, date) {
        let results = [...this.flights];
        if (from) {
            results = results.filter((flight) => flight.from.toLocaleLowerCase() === from.toLocaleLowerCase());
        }
        if (to) {
            results = results.filter((flight) => flight.to.toLocaleLowerCase() === to.toLocaleLowerCase());
        }
        if (date) {
            results = results.filter((flight) => flight.date === date);
        }
        return {
            flights: results,
            metadata: {
                total: results.length,
                from: from || "any",
                to: to || "any",
                date: date || "any",
            },
        };
    }
    getCheapestFlight(from, to, date) {
        let filtered = this.flights.filter((flight) => flight.from.toLocaleLowerCase() === from.toLocaleLowerCase() &&
            flight.to.toLocaleLowerCase() === to.toLocaleLowerCase());
        if (date) {
            filtered = filtered.filter((flight) => flight.date === date);
        }
        if (filtered.length === 0) {
            return null;
        }
        const cheapest = filtered.reduce((prev, current) => prev.price < current.price ? prev : current);
        return cheapest;
    }
    isLateArrival(arriveTime) {
        const [hours] = arriveTime.split(":").map(Number);
        return hours >= 18;
    }
    getHealthy() {
        return {
            service: "Flight Service",
            status: "OK",
            timestamp: new Date().toISOString(),
            totalFights: this.flights.length,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map