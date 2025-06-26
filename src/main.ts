import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use filter for all routes
  // This use instance to provide the HttpExceptionFilter
  // Instance will use more memory than class
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    }),
  );

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
