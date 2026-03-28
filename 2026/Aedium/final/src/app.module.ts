import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import mikroOrmConfig from './mikro-orm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ArticlesModule,
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
    CommentsModule,
  ],
})
export class AppModule {}
