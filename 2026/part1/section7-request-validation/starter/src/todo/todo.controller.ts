import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

//
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAllTodos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOneTodo(Number(id));
  }

  @Post()
  create(
    @Body()
    body: CreateTodoDto,
  ) {
    return this.todoService.createTodo(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTodoBody: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(Number(id), updateTodoBody);
  }

  @Delete(':id')
  deleteTodo(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = this.todoService.deleteTodo(Number(id));

    if (result) {
      return {
        message: 'Todo deleted successfully',
      };
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'bad request',
    });
  }
}
