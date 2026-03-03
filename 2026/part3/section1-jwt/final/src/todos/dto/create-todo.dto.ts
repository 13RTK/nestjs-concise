import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  isCompleted: boolean;
}
