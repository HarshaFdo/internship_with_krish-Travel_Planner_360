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
var BranchingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchingService = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("../clients.service");
const location_utils_1 = require("../../utils/location-utils");
let BranchingService = BranchingService_1 = class BranchingService {
    constructor(clientsService) {
        this.clientsService = clientsService;
        this.logger = new common_1.Logger(BranchingService_1.name);
    }
    async execute(from, to, date) {
        const startTime = Date.now();
        const isCoastal = (0, location_utils_1.isCoastalDestination)(to);
        const destinationType = isCoastal ? "coastal" : "inland";
        this.logger.log(`[Branching] Starting orchestration for ${from} -> ${to} on ${date}`);
        const elapsedTime = Date.now() - startTime;
        try {
            // always we have to fetch flight and hotels in parallel(scatter-gather)
            this.logger.log(`[Branching] Fetching flights and hotels in parallel...`);
            const [flightResponse, hotelResponse] = await Promise.allSettled([
                this.clientsService.getFlights(from, to, date),
                this.clientsService.getHotels(to, date),
            ]);
            const response = {
                flights: flightResponse.status === "fulfilled"
                    ? flightResponse.value.flights || []
                    : [],
                hotels: hotelResponse.status === "fulfilled"
                    ? hotelResponse.value.hotels || []
                    : [],
            };
            //based on the destination(coastal/inland) we have to fetch the activities
            if (isCoastal) {
                this.logger.log(`[Branching] Destination is Coastal - fetching events for ${to}...`);
                const eventResponse = await this.clientsService.getEvents(to, date);
                response.events = eventResponse.events || [];
                this.logger.log(`[Branching] Fetched the events - ${response.events.length} events that found.`);
            }
            else {
                this.logger.log(`[Branching] Destination is Inland - skiping the events service`);
            }
            response.metadata = {
                pattern: "Branching",
                destinationType: destinationType,
                eventsIncluded: isCoastal,
                elapsedTimeMs: elapsedTime,
                counts: {
                    flights: response.flights.length,
                    hotels: response.hotels.length,
                    events: response.events?.length || 0,
                },
            };
            this.logger.log(`[Branching] completed in ${elapsedTime} ms - 
        Flights: ${response.metadata.counts.flights}, 
        Hotels: ${response.metadata.counts.hotels}, 
        Events: ${response.metadata.counts.events}`);
            return response;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            this.logger.error(`[Branching] Error that occurred: ${errorMessage}`);
            return {
                error: errorMessage,
                metadata: {
                    pattern: "Branching",
                    destinationType: destinationType,
                    elapsedTimeMs: elapsedTime,
                },
            };
        }
    }
};
exports.BranchingService = BranchingService;
exports.BranchingService = BranchingService = BranchingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], BranchingService);
//# sourceMappingURL=branching.service.js.map