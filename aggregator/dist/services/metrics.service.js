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
    trackV1Request(endpoint) {
        this.metrics.v1Requests++;
        this.logger.log(`[Metrics] V1 request to ${endpoint} | Total V1 requests: ${this.metrics.v1Requests}`);
    }
    trackV2Request(endpoint) {
        this.metrics.v2Requests++;
        this.logger.log(`[Metrics] V2 request to ${endpoint} | Total V2 requests: ${this.metrics.v2Requests}`);
    }
    getMetrics() {
        const total = this.metrics.v1Requests + this.metrics.v2Requests;
        const v1Percentage = total ? (this.metrics.v1Requests / total) * 100 : 0;
        const v2Percentage = total ? (this.metrics.v2Requests / total) * 100 : 0;
        return {
            v1Requests: this.metrics.v1Requests,
            v2Requests: this.metrics.v2Requests,
            totalRequests: total,
            v1Percentage: v1Percentage.toFixed(2) + "%",
            v2Percentage: v2Percentage.toFixed(2) + "%",
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