import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';

import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterArticleDto } from './dto/filter-article.dto';
import { PaginationArticleDto } from './dto/pagination-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('public')
  @Public()
  findAllPublic(@Query() paginationArticleDto: PaginationArticleDto) {
    return this.articlesService.findAllPublic(paginationArticleDto);
  }

  @Get('public/:id')
  @Public()
  findOnePublic(@Param('id') id: number) {
    return this.articlesService.findOnePublic(id);
  }

  @Post('me')
  @ApiBearerAuth()
  createByCurrentUser(
    @Req() request: any,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.articlesService.createByUser(authorId, createArticleDto);
  }

  @Get('me')
  @ApiBearerAuth()
  findAllByCurrentUser(
    @Req() request: any,
    @Query() filterArticleDto: FilterArticleDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.articlesService.findAllByUser(authorId, filterArticleDto);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiBearerAuth()
  findAll(@Query() filterArticleDto: FilterArticleDto) {
    return this.articlesService.findAll(filterArticleDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }

  @Get('me/:id')
  @ApiBearerAuth()
  findOneByCurrentUser(@Req() request: any, @Param('id') id: number) {
    const authorId = Number(request.user.sub);

    return this.articlesService.findOneByUser(authorId, id);
  }

  @Patch('me/:id')
  @ApiBearerAuth()
  updateByCurrentUser(
    @Req() request: any,
    @Param('id') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.articlesService.updateByUser(
      authorId,
      articleId,
      updateArticleDto,
    );
  }

  @Delete('me/:id')
  @ApiBearerAuth()
  removeByCurrentUser(@Req() request: any, @Param('id') articleId: number) {
    const authorId = Number(request.user.sub);

    return this.articlesService.removeByUser(authorId, articleId);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiBearerAuth()
  remove(@Param('id') articleId: number) {
    return this.articlesService.remove(articleId);
  }
}
