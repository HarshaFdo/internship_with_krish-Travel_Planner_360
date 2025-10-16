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
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getWeather(destination, date) {
        try {
            return await this.appService.getWeather(destination ?? "", date ?? "");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Weather service error";
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                message: errorMessage,
                timestamp: new Date().toISOString(),
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    getHealthy() {
        return this.appService.getHealthy();
    }
    // Endpoint to update delay
    updateDelay(delayMs) {
        return this.appService.updateDelay(delayMs);
    }
    // Endpoint to reset the delay to orginal
    resetDelay() {
        return this.appService.resetDelay();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)("weather"),
    __param(0, (0, common_1.Query)("destination")),
    __param(1, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getWeather", null);
__decorate([
    (0, common_1.Get)("healthy"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealthy", null);
__decorate([
    (0, common_1.Put)("config/delay"),
    __param(0, (0, common_1.Body)("delayMs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateDelay", null);
__decorate([
    (0, common_1.Post)("config/delay/reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "resetDelay", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map