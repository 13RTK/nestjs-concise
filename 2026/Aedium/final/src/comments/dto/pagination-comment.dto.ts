import { IsInt, IsPositive } from 'class-validator';

export class PaginationCommentDto {
  @IsPositive()
  @IsInt()
  page: number;
}
