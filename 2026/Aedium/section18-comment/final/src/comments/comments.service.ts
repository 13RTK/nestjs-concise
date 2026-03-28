import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationCommentDto } from './dto/pagination-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    private readonly em: EntityManager,
    private readonly usersService: UsersService,
    private readonly articlesService: ArticlesService,
  ) {}

  COMMENT_LIMIT = 10;

  async createByUser(authorId: number, articleId: number, createCommentDto: CreateCommentDto) {
    await this.em.begin();

    await this.usersService.findOne(authorId);
    await this.articlesService.findOne(articleId);

    this.commentRepository.create({
      content: createCommentDto.content,
      article: articleId,
      author: authorId,
    });

    await this.em.flush();
    await this.em.commit();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
    };
  }

  async findAllByArticlePublic(articleId: number, paginationCommentDto: PaginationCommentDto) {
    const offset = (paginationCommentDto.page - 1) * this.COMMENT_LIMIT;

    const comments = await this.commentRepository.findAll({
      where: {
        article: {
          id: articleId,
        },
      },
      limit: this.COMMENT_LIMIT,
      offset,
      populate: ['author'],
      exclude: ['author.password', 'author.refreshToken', 'author.email', 'author.roles'],
    });

    return comments;
  }

  async findAll(paginationCommentDto: PaginationCommentDto) {
    const offset = (paginationCommentDto.page - 1) * this.COMMENT_LIMIT;

    const comments = await this.commentRepository.findAll({
      limit: this.COMMENT_LIMIT,
      offset,
      populate: ['author', 'article'],
      exclude: [
        'author.password',
        'author.refreshToken',
        'author.email',
        'author.roles',
        'article.content',
        'article.updatedAt',
        'article.createdAt',
      ],
    });

    return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async removeByUser(authorId: number, commentId: number) {
    await this.em.begin();

    await this.usersService.findOne(authorId);
    const comment = await this.findOne(commentId);

    await this.em.remove(comment).flush();
    await this.em.commit();

    return {
      statusCode: HttpStatus.OK,
      message: 'Comment deleted successfully',
    };
  }

  async remove(commentId: number) {
    await this.em.begin();

    const comment = await this.findOne(commentId);

    await this.em.remove(comment).flush();
    await this.em.commit();

    return {
      statusCode: HttpStatus.OK,
      message: 'Comment deleted successfully',
    };
  }
}
