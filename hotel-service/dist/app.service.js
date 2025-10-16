"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const hostels_data_1 = require("./data/hostels.data");
let AppService = AppService_1 = class AppService {
    constructor() {
        this.hostels = hostels_data_1.HOTELS_DATA;
        this.logger = new common_1.Logger(AppService_1.name);
    }
    getHotels(destination, date, lateCheckIn) {
        let results = [...this.hostels];
        if (destination) {
            results = results.filter((hotel) => hotel.destination.toLowerCase() === destination.toLowerCase());
        }
        if (lateCheckIn === "true") {
            results = results.filter((hotel) => hotel.lateCheckIn === true);
        }
        return {
            hotels: results,
            metadata: {
                total: results.length,
                destination: destination || "any",
                date: date || "any",
                lateCheckInOnly: lateCheckIn === "true",
            },
        };
    }
    getCheapestHotel(destination, lateCheckIn) {
        let filtered = this.hostels.filter((hotel) => hotel.destination.toLowerCase() === destination.toLowerCase());
        if (lateCheckIn) {
            filtered = filtered.filter((hotel) => hotel.lateCheckIn === true);
        }
        if (filtered.length === 0) {
            throw new common_1.NotFoundException({
                message: "No hotels found for the specified criteria.",
                destination,
                lateCheckInOnly: lateCheckIn || false,
            });
        }
        const cheapest = filtered.reduce((prev, current) => prev.pricePerNight < current.pricePerNight ? prev : current);
        this.logger.log(`Cheapest hotel found: ${cheapest.name} at $${cheapest.pricePerNight}/night`);
        return cheapest;
    }
    getHeathy() {
        return {
            service: "Hotel Service",
            status: "OK",
            timestamp: new Date().toISOString(),
            totalHotels: this.hostels.length,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map