import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TodosModule, MikroOrmModule.forRoot(), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
