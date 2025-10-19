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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerController = void 0;
const common_1 = require("@nestjs/common");
const circuit_breaker_1 = require("../utils/circuit-breaker");
let CircuitBreakerController = class CircuitBreakerController {
    constructor(circuitBreaker) {
        this.circuitBreaker = circuitBreaker;
    }
    getCircuitBreakerState() {
        return this.circuitBreaker.getState();
    }
};
exports.CircuitBreakerController = CircuitBreakerController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CircuitBreakerController.prototype, "getCircuitBreakerState", null);
exports.CircuitBreakerController = CircuitBreakerController = __decorate([
    (0, common_1.Controller)('v2/circuit-breaker'),
    __metadata("design:paramtypes", [circuit_breaker_1.CircuitBreaker])
], CircuitBreakerController);
//# sourceMappingURL=circuit-breaker.controller.js.map