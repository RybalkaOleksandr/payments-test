import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// test
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
