import { Injectable, Logger } from "@nestjs/common";

interface TrafficMetrics {
  v1Requests: number;
  v2Requests: number;
  startTime: Date;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private metrics: TrafficMetrics = {
    v1Requests: 0,
    v2Requests: 0,
    startTime: new Date(),
  };

  trackRequest(version: "v1" | "v2", endpoint: string) {
    const key = version === "v1" ? "v1Requests" : "v2Requests";
    this.metrics[key]++;
    this.logger.log(
      `[Metrics] ${version.toUpperCase()} request to ${endpoint} | Total ${version.toUpperCase()} requests: ${this.metrics[key]}`
    );
  }

  getMetrics() {
    const { v1Requests, v2Requests } = this.metrics;
    const total = v1Requests + v2Requests;

    const calcPercentage = (count: number) =>
      total ? ((count / total) * 100).toFixed(2) + "%" : "0.00%";

    return {
      v1Requests,
      v2Requests,
      totalRequests: total,
      v1Percentage: calcPercentage(v1Requests),
      v2Percentage: calcPercentage(v2Requests),
      uptime: this.getUptime(),
    };
  }

  private getUptime() {
    const now = new Date();
    const difference = now.getTime() - this.metrics.startTime.getTime();
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
}
