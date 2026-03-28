import { p } from '@mikro-orm/core';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PaginationArticleDto } from '../articles/dto/pagination-article.dto';
import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('me/:id')
  @ApiBearerAuth()
  createByUser(
    @Req() request: any,
    @Param('id') articleId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.commentsService.createByUser(authorId, articleId, createCommentDto);
  }

  @Get('public')
  @Public()
  findAllByArticlePublic(
    @Query() articleId: number,
    @Body() paginationCommentDto: PaginationArticleDto,
  ) {
    return this.commentsService.findAllByArticlePublic(articleId, paginationCommentDto);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiBearerAuth()
  findAll(@Body() paginationCommentDto: PaginationArticleDto) {
    return this.commentsService.findAll(paginationCommentDto);
  }

  @Delete('me/:id')
  @ApiBearerAuth()
  removeByUser(@Req() request: any, @Param('id') commentId: number) {
    const authorId = Number(request.user.sub);

    return this.commentsService.removeByUser(authorId, commentId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  remove(@Param('id') commentId: number) {
    return this.commentsService.remove(commentId);
  }
}
