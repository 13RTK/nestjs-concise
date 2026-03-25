import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

import { ArticleStatus } from "../entities/article.entity";

export class CreateArticleDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  content: string;

  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
