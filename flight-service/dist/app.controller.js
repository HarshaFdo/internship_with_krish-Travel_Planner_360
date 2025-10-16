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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const search_flights_dto_1 = require("./dto/search-flights.dto");
const get_cheapest_flight_dto_1 = require("./dto/get-cheapest-flight.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getFlights(query) {
        return this.appService.getFlights(query);
    }
    getCheapestFlight(query) {
        const cheapest = this.appService.getCheapestFlight(query);
        if (!cheapest) {
            throw new common_1.NotFoundException({
                message: "No flight is found for your specified route.",
                from: query.from,
                to: query.to,
                date: query.date || "any",
            });
        }
        const isLateArrival = this.appService.isLateArrival(cheapest.arriveTime);
        return {
            flights: cheapest,
            lateArrival: isLateArrival,
        };
    }
    getHealthy() {
        return this.appService.getHealthy();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)("flights"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_flights_dto_1.SearchFlightDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getFlights", null);
__decorate([
    (0, common_1.Get)("flights/cheapest"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_cheapest_flight_dto_1.GetCheapestFlightDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCheapestFlight", null);
__decorate([
    (0, common_1.Get)("healthy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealthy", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map