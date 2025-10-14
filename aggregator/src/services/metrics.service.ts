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

  trackV1Request(endpoint: string) {
    this.metrics.v1Requests++;
    this.logger.log(
      `[Metrics] V1 request to ${endpoint} | Total V1 requests: ${this.metrics.v1Requests}`
    );
  }

  trackV2Request(endpoint: string) {
    this.metrics.v2Requests++;
    this.logger.log(
      `[Metrics] V2 request to ${endpoint} | Total V2 requests: ${this.metrics.v2Requests}`
    );
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

  private getUptime() {
    const now = new Date();
    const difference = now.getTime() - this.metrics.startTime.getTime();
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
}
