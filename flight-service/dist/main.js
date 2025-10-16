"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enabling global valodation
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true, // Playloads are transform to DTO instnces, automatically
        whitelist: true, // // Strip properties that don't have decorators
        forbidNonWhitelisted: false, // Don't throw error for extra properties
        transformOptions: {
            enableImplicitConversion: true, // Enable implicit type conversion
        },
    }));
    await app.listen(3001);
    console.log(`Flight service is running on: http://localhost:3001`);
}
bootstrap();
//# sourceMappingURL=main.js.map