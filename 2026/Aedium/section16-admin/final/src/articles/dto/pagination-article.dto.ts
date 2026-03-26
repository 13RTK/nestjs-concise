import { IsInt, IsPositive } from 'class-validator';

export class PaginationArticleDto {
  @IsPositive()
  @IsInt()
  page: number;
}
