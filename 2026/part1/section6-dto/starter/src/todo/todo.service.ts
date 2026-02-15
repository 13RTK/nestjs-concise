import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  todos = [
    {
      id: 1,
      title: 'Todo 1',
    },
    {
      id: 2,
      title: 'Todo 2',
    },
    {
      id: 3,
      title: 'Todo 3',
    },
  ];

  findAllTodos() {
    return this.todos;
  }

  findOneTodo(id: number) {
    return this.todos.find((todo) => Number(todo.id) === Number(id));
  }

  createTodo(newTodo: { id: number; title: string }) {
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: number, updateTodo: { title: string }) {
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
