import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3004);
  console.log(`Weather service is running on: http://localhost:3004`);
  console.log('Delay:', process.env.WEATHER_DELAY_MS || '0', 'ms');
  console.log('Fail Rate:', process.env.WEATHER_FAIL_RATE || '0');
}
bootstrap();
