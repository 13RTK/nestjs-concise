import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { PaginationArticleDto } from "./pagination-article.dto";

export class FilterArticleDto extends PaginationArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}
