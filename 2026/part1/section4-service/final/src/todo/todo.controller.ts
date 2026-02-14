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

@Controller('todo')
export class TodoController {
  @Get()
  findAll() {
    // TODO: implement service
    // return findAllTodos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: implement service
    // return findOneTodo(Number(id));
  }

  @Post()
  create(@Body() body: { id: number; title: string }) {
    // TODO: implement service
    // return createTodo(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoBody: { id: number; title: string },
  ) {
    // TODO: implement service
    // return updateTodo(Number(id), updateTodoBody);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string, @Res() response: Response) {
    // TODO: implement service
    // const result = deleteTodoService(Number(id));
    // if (result) {
    //   return response.json({
    //     message: 'Todo deleted successfully',
    //   });
    // }
    // return response.status(HttpStatus.BAD_REQUEST).json({
    //   message: 'bad request',
    // });
  }
}
