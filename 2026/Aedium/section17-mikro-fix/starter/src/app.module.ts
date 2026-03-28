import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import mikroOrmConfig from '../mikro-orm.config';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ArticlesModule, MikroOrmModule.forRoot(mikroOrmConfig), AuthModule],
})
export class AppModule {}
