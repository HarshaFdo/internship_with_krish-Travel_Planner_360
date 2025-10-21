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
var HttpClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.SERVICE_URL = void 0;
require('dotenv').config();
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
exports.SERVICE_URL = {
    flights: process.env.FLIGHTS_SERVICE_URL,
    hotels: process.env.HOTELS_SERVICE_URL,
    events: process.env.EVENTS_SERVICE_URL,
    weather: process.env.WEATHER_SERVICE_URL,
};
let HttpClient = HttpClient_1 = class HttpClient {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(HttpClient_1.name);
    }
    async call(method, endpoint, body, queries) {
        // Filter the undefined values to avoid sending them as query parameters.
        const cleanQuery = queries
            ? Object.fromEntries(Object.entries(queries).filter(([_, v]) => v !== undefined))
            : undefined;
        try {
            let response;
            if (["GET", "DELETE", "POST", "PUT", "PATCH"].includes(method)) {
                response = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                    method,
                    url: endpoint,
                    data: body,
                    params: cleanQuery,
                }));
            }
            else {
                throw new common_1.BadRequestException(`Unsupported HTTP method: ${method}`);
            }
            return response.data;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error fetching from ${endpoint}: ${message}`);
            throw new common_1.InternalServerErrorException(`Failed to fetch from ${endpoint} service`);
        }
    }
};
exports.HttpClient = HttpClient;
exports.HttpClient = HttpClient = HttpClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], HttpClient);
//# sourceMappingURL=HttpClient.js.map