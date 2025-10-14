import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  logger.log(`Aggregator service is running on: http://localhost:3000`);
  logger.log("")

  logger.log(`V1 API endpoints:`);
  logger.log("   - GET /v1/trips/search");
  logger.log("   - GET /v1/trips/cheapest-route");
  logger.log("   - GET /v1/trips/contextual");
  logger.log("")

  logger.log("V2 API Endpoints (Strangler Pattern):");
  logger.log("   - GET /v2/trips/search (+ weather)");
  logger.log("");

  logger.log("Metrics:");
  logger.log("   - GET /metrics (track V1 vs V2 adoption)");
  logger.log("");

  logger.log("Migration Strategy:");
  logger.log("   - V1 /search: flights + hotels");
  logger.log("   - V2 /search: flights + hotels + weather");
  logger.log("   - Other endpoints remain V1 (Strangler-Fig)");
}
bootstrap();
