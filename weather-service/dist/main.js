"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3004);
    // Enable global validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    console.log(`Weather service is running on: http://localhost:3004`);
    console.log('Delay:', process.env.WEATHER_DELAY_MS || '0', 'ms');
    console.log('Fail Rate:', process.env.WEATHER_FAIL_RATE || '0');
}
bootstrap();
//# sourceMappingURL=main.js.map