import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove other properties not listed
    forbidNonWhitelisted: true, // Return error if other properties not listed
    transform: true, // Transform properties to expected types
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
