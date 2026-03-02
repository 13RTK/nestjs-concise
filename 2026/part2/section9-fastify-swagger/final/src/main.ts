import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DbExceptionFilter } from './filters/db-exception.filter';
import { Logger } from 'nestjs-pino';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  // Express version
  // const app = await NestFactory.create(AppModule, {
  //   logger: false,
  // });

  // Fastify version
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new DbExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
