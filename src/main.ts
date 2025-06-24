import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    await app.listen(process.env.PORT || 3000);
    console.log(
      `Application is running on: http://localhost:${process.env.PORT || 3000}`,
    );
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
}
bootstrap();
