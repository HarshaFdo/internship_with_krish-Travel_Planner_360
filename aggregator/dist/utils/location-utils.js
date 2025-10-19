"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCoastalDestination = isCoastalDestination;
exports.isInlandDestination = isInlandDestination;
exports.getDestinationType = getDestinationType;
const types_1 = require("../types");
const COASTAL_DESTINATIONS = [
    "MLE", // Maldives
    "GOA", // Goa, India
    "DXB", // Dubai
    "SIN", // Singapore
    "HKT", // Phuket
];
const INLAND_DESTINATIONS = [
    "BKK", // Bangkok
    "DEL", // Delhi
    "KUL", // Kuala Lumpur
];
function isCoastalDestination(destination) {
    return COASTAL_DESTINATIONS.includes(destination.toUpperCase());
}
function isInlandDestination(destination) {
    return INLAND_DESTINATIONS.includes(destination.toUpperCase());
}
function getDestinationType(destination) {
    const upper = destination.toUpperCase();
    if (COASTAL_DESTINATIONS.includes(upper)) {
        return types_1.DestinationType.COASTAL;
    }
    if (INLAND_DESTINATIONS.includes(upper)) {
        return types_1.DestinationType.INLAND;
    }
    return "unknown";
}
//# sourceMappingURL=location-utils.js.map