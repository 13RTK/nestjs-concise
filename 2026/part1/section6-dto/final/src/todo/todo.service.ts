import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  todos: Todo[] = [
    {
      id: 1,
      title: 'Todo 1',
      content: 'Content 1',
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Todo 2',
      content: 'Content 2',
      isCompleted: false,
    },
    {
      id: 3,
      title: 'Todo 3',
      content: 'Content 3',
      isCompleted: false,
    },
  ];

  findAllTodos() {
    return this.todos;
  }

  findOneTodo(id: number) {
    return this.todos.find((todo) => Number(todo.id) === Number(id));
  }

  createTodo(newTodo: CreateTodoDto) {
    this.todos.push({ id: Date.now(), ...newTodo });
    return newTodo;
  }

  updateTodo(id: number, updateTodo: UpdateTodoDto) {
    this.todos = this.todos.map((todo) => {
      if (Number(todo.id) === Number(id)) {
        return {
          ...todo,
          ...updateTodo,
        };
      }
      return todo;
    });

    return updateTodo;
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => Number(todo.id) !== Number(id));

    return true;
  }
}
