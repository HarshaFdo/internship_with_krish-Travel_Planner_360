import { DestinationType } from "../types";

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

export function isCoastalDestination(destination: string): boolean {
  return COASTAL_DESTINATIONS.includes(destination.toUpperCase());
}

export function isInlandDestination(destination: string): boolean {
  return INLAND_DESTINATIONS.includes(destination.toUpperCase());
}

export function getDestinationType(
  destination: DestinationType
) : DestinationType | "unknown" {
  const upper = destination.toUpperCase();

  if (COASTAL_DESTINATIONS.includes(upper)) {
    return DestinationType.COASTAL;
  }

  if (INLAND_DESTINATIONS.includes(upper)) {
    return DestinationType.INLAND;
  }

  return "unknown";
}
