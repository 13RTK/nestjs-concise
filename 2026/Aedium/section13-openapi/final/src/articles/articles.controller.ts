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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationArticleDto } from './dto/pagination-article.dto';
import { FilterArticleDto } from './dto/filter-article.dto';
import { Public } from '../auth/decorator/public.decorator';

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
  createByCurrentUser(
    @Req() request: any,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.articlesService.createByUser(authorId, createArticleDto);
  }

  @Get('me')
  findAllByCurrentUser(
    @Req() request: any,
    @Query() filterArticleDto: FilterArticleDto,
  ) {
    const authorId = Number(request.user.sub);

    return this.articlesService.findAllByUser(authorId, filterArticleDto);
  }

  @Get()
  // TODO: only available for admin
  findAll(@Query() filterArticleDto: FilterArticleDto) {
    return this.articlesService.findAll(filterArticleDto);
  }

  @Get(':id')
  // TODO: only available for admin
  findOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }

  @Get('me/:id')
  findOneByCurrentUser(@Req() request: any, @Param('id') id: number) {
    const authorId = Number(request.user.sub);

    return this.articlesService.findOneByUser(authorId, id);
  }

  @Patch('me/:id')
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
  removeByCurrentUser(@Req() request: any, @Param('id') articleId: number) {
    const authorId = Number(request.user.sub);

    return this.articlesService.removeByUser(authorId, articleId);
  }
}
