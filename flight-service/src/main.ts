import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabling global valodation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Playloads are transform to DTO instnces, automatically
      whitelist: true, // // Strip properties that don't have decorators
      forbidNonWhitelisted: false, // Don't throw error for extra properties
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    })
  );

  await app.listen(3001);
  console.log(`Flight service is running on: http://localhost:3001`);
}
bootstrap();
