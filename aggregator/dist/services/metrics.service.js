"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
let MetricsService = MetricsService_1 = class MetricsService {
    constructor() {
        this.logger = new common_1.Logger(MetricsService_1.name);
        this.metrics = {
            v1Requests: 0,
            v2Requests: 0,
            startTime: new Date(),
        };
    }
    trackRequest(version, endpoint) {
        const key = version === "v1" ? "v1Requests" : "v2Requests";
        this.metrics[key]++;
        this.logger.log(`[Metrics] ${version.toUpperCase()} request to ${endpoint} | Total ${version.toUpperCase()} requests: ${this.metrics[key]}`);
    }
    getMetrics() {
        const { v1Requests, v2Requests } = this.metrics;
        const total = v1Requests + v2Requests;
        const calcPercentage = (count) => total ? ((count / total) * 100).toFixed(2) + "%" : "0.00%";
        return {
            v1Requests,
            v2Requests,
            totalRequests: total,
            v1Percentage: calcPercentage(v1Requests),
            v2Percentage: calcPercentage(v2Requests),
            uptime: this.getUptime(),
        };
    }
    getUptime() {
        const now = new Date();
        const difference = now.getTime() - this.metrics.startTime.getTime();
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map