import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Article } from './entities/article.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Article])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
