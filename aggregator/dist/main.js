"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger("Bootstrap");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable global validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    await app.listen(3000);
    logger.log(`Aggregator service is running on: http://localhost:3000`);
    logger.log("");
    logger.log(`V1 API endpoints:`);
    logger.log("   - GET /v1/trips/search");
    logger.log("   - GET /v1/trips/cheapest-route");
    logger.log("   - GET /v1/trips/contextual");
    logger.log("");
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
//# sourceMappingURL=main.js.map