let todos = [
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

export function findAllTodos() {
  return todos;
}

export function findOneTodo(id) {
  return todos.find((todo) => Number(todo.id) === Number(id));
}

export function createTodo(newTodo) {
  todos.push(newTodo);
  return newTodo;
}

export function updateTodo(id, updateTodo) {
  todos = todos.map((todo) => {
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

export function deleteTodo(id) {
  todos = todos.filter((todo) => Number(todo.id) !== Number(id));

  return true;
}
