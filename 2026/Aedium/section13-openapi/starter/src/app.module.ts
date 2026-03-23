import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
  imports: [
    UsersModule,
    ArticlesModule,
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
  ],
})
export class AppModule {}
