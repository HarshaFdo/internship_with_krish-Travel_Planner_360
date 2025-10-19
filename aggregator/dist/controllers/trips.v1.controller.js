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
exports.MetricsController = exports.TripsV1Controller = void 0;
const common_1 = require("@nestjs/common");
const scatter_gather_1 = require("../utils/scatter-gather");
const chaining_1 = require("../utils/chaining");
const branching_1 = require("../utils/branching");
const trip_search_dto_1 = require("../dto/trip-search.dto");
const aggregator_service_1 = require("../services/aggregator.service");
let TripsV1Controller = class TripsV1Controller {
    constructor(scatterGather, chaining, branching, metrics) {
        this.scatterGather = scatterGather;
        this.chaining = chaining;
        this.branching = branching;
        this.metrics = metrics;
    }
    // for scatter-gather pattern
    async search(query) {
        this.metrics.trackRequest("v1", "/v1/trips/search");
        return this.scatterGather.execute(query.from, query.to, query.date);
    }
    // for chaining pattern
    async cheapestRoute(query) {
        this.metrics.trackRequest("v1", "/v1/trips/cheapest-route");
        return this.chaining.execute(query.from, query.to, query.date);
    }
    // for branching pattern
    async contextual(query) {
        this.metrics.trackRequest("v1", "/v1/trips/contextual");
        return this.branching.execute(query.from, query.to, query.date);
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
    __metadata("design:paramtypes", [scatter_gather_1.ScatterGather,
        chaining_1.Chaining,
        branching_1.Branching,
        aggregator_service_1.AggregatorService])
], TripsV1Controller);
let MetricsController = class MetricsController {
    constructor(metrics) {
        this.metrics = metrics;
    }
    getMetrics() {
        return this.metrics.getMetrics();
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetricsController.prototype, "getMetrics", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)("metrics"),
    __metadata("design:paramtypes", [aggregator_service_1.AggregatorService])
], MetricsController);
//# sourceMappingURL=trips.v1.controller.js.map