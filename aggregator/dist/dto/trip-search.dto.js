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
exports.TripSearchDto = void 0;
const class_validator_1 = require("class-validator");
class TripSearchDto {
}
exports.TripSearchDto = TripSearchDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'from is required' }),
    (0, class_validator_1.IsString)({ message: 'from must be a valid string' }),
    __metadata("design:type", String)
], TripSearchDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'to is required' }),
    (0, class_validator_1.IsString)({ message: 'from must be a valid string' }),
    __metadata("design:type", String)
], TripSearchDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'from is required' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Date must be in YYYY-MM-DD format' }),
    __metadata("design:type", String)
], TripSearchDto.prototype, "date", void 0);
//# sourceMappingURL=trip-search.dto.js.map