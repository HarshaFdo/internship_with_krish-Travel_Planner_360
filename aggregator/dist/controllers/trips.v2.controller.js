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
var TripsV2Controller_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsV2Controller = void 0;
const common_1 = require("@nestjs/common");
const scatter_gather_1 = require("../utils/scatter-gather");
const trip_search_dto_1 = require("../dto/trip-search.dto");
const metrics_1 = require("../utils/metrics");
const aggregator_service_1 = require("../services/aggregator.service");
let TripsV2Controller = TripsV2Controller_1 = class TripsV2Controller {
    constructor(scatterGather, metrics, aggregatorService) {
        this.scatterGather = scatterGather;
        this.metrics = metrics;
        this.aggregatorService = aggregatorService;
        this.logger = new common_1.Logger(TripsV2Controller_1.name);
    }
    // for scatter-gather pattern
    async search(query) {
        this.metrics.trackRequest("v2", "/v2/trips/search");
        this.logger.log(`[V2] /search called with from=${query.from}, to=${query.to}, date=${query.date}`);
        // pass true value to sinclude weather for v2
        const response = await this.aggregatorService.executeScatterGather(query.from, query.to, query.date, true);
        return {
            ...response,
            version: "v2",
        };
    }
};
exports.TripsV2Controller = TripsV2Controller;
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trip_search_dto_1.TripSearchDto]),
    __metadata("design:returntype", Promise)
], TripsV2Controller.prototype, "search", null);
exports.TripsV2Controller = TripsV2Controller = TripsV2Controller_1 = __decorate([
    (0, common_1.Controller)("v2/trips"),
    __metadata("design:paramtypes", [scatter_gather_1.ScatterGather,
        metrics_1.Metrics,
        aggregator_service_1.AggregatorService])
], TripsV2Controller);
//# sourceMappingURL=trips.v2.controller.js.map