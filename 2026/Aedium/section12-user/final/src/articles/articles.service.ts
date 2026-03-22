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

  async createByUser(authorId: number, createArticleDto: CreateArticleDto) {
    const user = await this.em.findOne(User, { id: authorId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.articleRepository.create({
      ...createArticleDto,
      author: user,
    });

    await this.em.flush();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Article created successfully',
    };
  }

  async findAllByUser(authorId: number, filterArticleDto: FilterArticleDto) {
    const { page, query } = filterArticleDto;
    const limit = Number(process.env.ARTICLE_LIST_LIMIT) || 10;
    const offset = (page - 1) * limit;

    const where: any = {
      author: {
        id: authorId,
      },
    };

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

  // TODO: only available for admin
  async findAll(filterArticleDto: FilterArticleDto) {
    const { page, query } = filterArticleDto;
    const limit = Number(process.env.ARTICLE_LIST_LIMIT) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

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

  /**
   * All the user(without login) can access to retrieve all the public articles
   *
   * @param filterArticleDto
   * @returns the articles
   */
  async findAllPublic(filterArticleDto: FilterArticleDto) {
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

  // TODO: only available for admin
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

  async findOneByUser(authorId: number, articleId: number) {
    const article = await this.findOneWithAuthorId(articleId, authorId);

    return article;
  }

  /**
   * All the user(without login) can access to retrieve specified public article details
   *
   * @param id the id of article
   * @returns specified article
   */
  async findOnePublic(id: number) {
    const article = await this.articleRepository.findOne(
      { id, status: ArticleStatus.PUBLISHED },
      {
        populate: ['author'],
        exclude: ['author.password', 'author.refreshToken', 'author.email'],
      },
    );

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async updateByUser(
    authorId: number,
    articleId: number,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.findOneWithAuthorId(articleId, authorId);

    this.em.assign(article, updateArticleDto);

    await this.em.flush();

    return {
      statusCode: HttpStatus.OK,
      message: 'Article updated successfully',
    };
  }

  async removeByUser(authorId: number, articleId: number) {
    const article = await this.findOneWithAuthorId(articleId, authorId);

    await this.em.remove(article).flush();

    return {
      statusCode: HttpStatus.OK,
      message: 'Article deleted successfully',
    };
  }

  private async findOneWithAuthorId(articleId: number, authorId: number) {
    const article = await this.articleRepository.findOne({
      id: articleId,
      author: {
        id: authorId,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
