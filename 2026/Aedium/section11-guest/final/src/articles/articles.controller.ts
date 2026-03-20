import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  // TODO: only available for admin
  findAll(@Query() filterArticleDto: FilterArticleDto) {
    return this.articlesService.findAll(filterArticleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.articlesService.remove(id);
  }
}
