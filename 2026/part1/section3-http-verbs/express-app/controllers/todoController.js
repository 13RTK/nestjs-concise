import {
  findAllTodos,
  findOneTodo,
  createTodo,
  deleteTodo as deleteTodoService,
  updateTodo,
} from '../services/todoService.js';

export function findAll(_req, res) {
  return res.json(findAllTodos());
}

export function findOne(req, res) {
  const { id } = req.params;

  return res.json(findOneTodo(Number(id)));
}

export function create(req, res) {
  const newTodo = req.body;
  console.log(newTodo);

  return res.json(createTodo(newTodo));
}

export function update(req, res) {
  const { id } = req.params;
  const updateTodoBody = req.body;

  return res.json(updateTodo(Number(id), updateTodoBody));
}

export function deleteTodo(req, res) {
  const { id } = req.params;

  const result = deleteTodoService(Number(id));

  if (result) {
    return res.json({
      message: 'Todo deleted successfully',
    });
  }
  return res.status(400).json({
    message: 'bad request',
  });
}
