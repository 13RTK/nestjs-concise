import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Article, ArticleStatus } from './entities/article.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../users/entities/user.entity';
import { FilterArticleDto } from './dto/filter-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    private readonly em: EntityManager,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const { authorId, ...createArticleData } = createArticleDto;

    const user = await this.em.findOne(User, { id: authorId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.articleRepository.create({
      ...createArticleData,
      author: user,
    });

    await this.em.flush();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Article created successfully',
    };
  }

  async findAll(filterArticleDto: FilterArticleDto) {
    const { page, query } = filterArticleDto;
    const limit = Number(process.env.ARTICLE_LIST_LIMIT) || 10;
    const offset = (page - 1) * limit;

    // Only published articles can be seen
    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    // Only user with query can search
    if (query && query.trim().length > 0) {
      where.title = {
        $ilike: `%${query}%`,
      };
    }

    const articles = await this.articleRepository.findAll({
      limit,
      offset,
      exclude: ['content', 'updatedAt'],
      where,
    });

    return articles;
  }

  async findOne(id: number) {
    // TODO: Add populate about author
    const article = await this.articleRepository.findOne(id, {
      populate: ['author'],
      exclude: ['author.password'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);

    const { authorId, ...updateArticleData } = updateArticleDto;

    this.em.assign(article, updateArticleData);

    await this.em.flush();

    return {
      statusCode: HttpStatus.OK,
      message: 'Article updated successfully',
    };
  }

  async remove(id: number) {
    const article = await this.findOne(id);

    await this.em.remove(article).flush();

    return {
      statusCode: HttpStatus.OK,
      message: 'Article deleted successfully',
    };
  }
}
