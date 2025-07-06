import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    credentials: true,
    origin: [process.env.SITE_URL],
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
