import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoHttpConfig } from './common/configs/pino';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfigs } from './common/configs/rate-limit';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TodosModule,
    MikroOrmModule.forRoot(),
    UsersModule,
    LoggerModule.forRoot({
      pinoHttp: pinoHttpConfig,
    }),
    AuthModule,
    ThrottlerModule.forRoot(rateLimitConfigs),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
