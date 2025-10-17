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
const events_data_1 = require("./data/events.data");
let AppService = class AppService {
    constructor() {
        this.events = events_data_1.EVENTS_DATA;
    }
    getEvents(query) {
        let results = [...this.events];
        if (query.destination) {
            results = results.filter((event) => event.destination.toLowerCase() === query.destination.toLowerCase());
        }
        if (query.date) {
            results = results.filter((event) => event.date === query.date);
        }
        if (query.category) {
            results = results.filter((event) => event.category.toLowerCase() === query.category.toLowerCase());
        }
        return {
            events: results,
            metadata: {
                total: results.length,
                destination: query.destination || "any",
                date: query.date || "any",
                category: query.category || "any",
            },
        };
    }
    getHealthy() {
        return {
            service: "events-service",
            status: "OK",
            timestamp: new Date().toISOString(),
            totalEvents: this.events.length,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map