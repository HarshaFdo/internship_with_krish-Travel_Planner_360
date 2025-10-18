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
exports.TripsV1Controller = void 0;
const common_1 = require("@nestjs/common");
const scatter_gather_service_1 = require("../services/patterns/scatter-gather.service");
const chaining_service_1 = require("../services/patterns/chaining.service");
const branching_service_1 = require("../services/patterns/branching.service");
const metrics_service_1 = require("../services/metrics.service");
const trip_search_dto_1 = require("../dto/trip-search.dto");
let TripsV1Controller = class TripsV1Controller {
    constructor(scatterGatherService, chainingService, branchingService, metricsService) {
        this.scatterGatherService = scatterGatherService;
        this.chainingService = chainingService;
        this.branchingService = branchingService;
        this.metricsService = metricsService;
    }
    // for scatter-gather pattern
    async search(query) {
        this.metricsService.trackRequest("v1", "/v1/trips/search");
        return this.scatterGatherService.execute(query.from, query.to, query.date);
    }
    // for chaining pattern
    async cheapestRoute(query) {
        this.metricsService.trackRequest("v1", "/v1/trips/cheapest-route");
        return this.chainingService.execute(query.from, query.to, query.date);
    }
    // for branching pattern
    async contextual(query) {
        this.metricsService.trackRequest("v1", "/v1/trips/contextual");
        return this.branchingService.execute(query.from, query.to, query.date);
    }
};
exports.TripsV1Controller = TripsV1Controller;
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trip_search_dto_1.TripSearchDto]),
    __metadata("design:returntype", Promise)
], TripsV1Controller.prototype, "search", null);
__decorate([
    (0, common_1.Get)("cheapest-route"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trip_search_dto_1.TripSearchDto]),
    __metadata("design:returntype", Promise)
], TripsV1Controller.prototype, "cheapestRoute", null);
__decorate([
    (0, common_1.Get)("contextual"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trip_search_dto_1.TripSearchDto]),
    __metadata("design:returntype", Promise)
], TripsV1Controller.prototype, "contextual", null);
exports.TripsV1Controller = TripsV1Controller = __decorate([
    (0, common_1.Controller)("v1/trips"),
    __metadata("design:paramtypes", [scatter_gather_service_1.ScatterGatherService,
        chaining_service_1.ChainingService,
        branching_service_1.BranchingService,
        metrics_service_1.MetricsService])
], TripsV1Controller);
//# sourceMappingURL=trips.v1.controller.js.map