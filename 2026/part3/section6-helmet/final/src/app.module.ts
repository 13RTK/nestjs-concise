import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { pinoHttpConfig } from './configs/pino';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TodosModule,
    MikroOrmModule.forRoot(),
    UsersModule,
    LoggerModule.forRoot({
      pinoHttp: pinoHttpConfig,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
