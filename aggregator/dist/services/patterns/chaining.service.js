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
var ChainingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainingService = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("../clients.service");
let ChainingService = ChainingService_1 = class ChainingService {
    constructor(clientsService) {
        this.clientsService = clientsService;
        this.logger = new common_1.Logger(ChainingService_1.name);
    }
    async execute(from, to, date) {
        const startTime = Date.now();
        this.logger.log(`[Chaining] is starting squential ochestration for ${from} -> ${to} on `);
        const elapsedTime = Date.now() - startTime;
        try {
            // step 1: getting the cheapest flight
            this.logger.log("[Chaining] 1. Fetching the cheapest fright...");
            const flightResponse = await this.clientsService.getCheapestFlight(from, to, date);
            if (!flightResponse.flights) {
                this.logger.warn(`[Chaining] No flight is found`);
                throw new common_1.NotFoundException({
                    message: "No flight is found for your specified route and date.",
                    from,
                    to,
                    date,
                });
            }
            const flight = flightResponse.flights;
            const isLateArrival = flightResponse.lateArrival || false;
            this.logger.log(`[Chaining] 1- complete. Fetched the cheapest flight: ${flight.id} - Arrival: ${flight.arriveTime} - Late Arrival: ${isLateArrival}`);
            // step 2: getting the cheapest hotel based on the arrival time.
            this.logger.log(`[Chaining] 2. Fetching the cheapest hotel (lateArrival: ${isLateArrival}) ...`);
            const hotelResponse = await this.clientsService.getCheapestHotel(to, isLateArrival);
            if (!hotelResponse.hotels) {
                this.logger.warn(`[Chaining] No hotel is found`);
                throw new common_1.NotFoundException({
                    message: "No hotel is found for your specified destination.",
                    from,
                    to,
                    date,
                });
            }
            const hotel = hotelResponse.hotels;
            this.logger.log(`[Chaining] 2- complete. Fetched the cheapest hotel: ${hotel.id} - Late check-in: ${hotel.lateCheckIn}`);
            this.logger.log(`[Chaining] All done - total time: ${elapsedTime}ms`);
            return {
                flight: {
                    id: flight.id,
                    from: flight.from,
                    to: flight.to,
                    airline: flight.airline,
                    date: flight.date,
                    departTime: flight.departTime,
                    arriveTime: flight.arriveTime,
                    price: flight.price,
                    class: flight.class,
                },
                hotel: {
                    id: hotel.id,
                    name: hotel.name,
                    rating: hotel.rating,
                    pricePerNight: hotel.pricePerNight,
                    lateCheckIn: hotel.lateCheckIn,
                },
                metadata: {
                    pattern: "Chaining",
                    lateArrival: isLateArrival,
                    elapsedTimeMs: elapsedTime,
                    totalCost: flight.price + hotel.pricePerNight,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error";
            const errorStack = error instanceof Error ? error.stack : "";
            this.logger.error(`[Chaining] Error occurred: ${errorMessage}`);
            return {
                error: errorMessage,
                stack: errorStack,
                metadata: {
                    pattern: "Chaining",
                    elapsedTimeMs: elapsedTime,
                },
            };
        }
    }
};
exports.ChainingService = ChainingService;
exports.ChainingService = ChainingService = ChainingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ChainingService);
//# sourceMappingURL=chaining.service.js.map