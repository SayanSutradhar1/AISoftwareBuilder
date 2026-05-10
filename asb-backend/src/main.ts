import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.useGlobalInterceptors(new LoggingInterceptor(new Logger()));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
