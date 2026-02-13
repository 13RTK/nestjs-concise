import { Router } from 'express';
import {
  findAll,
  findOne,
  deleteTodo,
  create,
  update,
} from '../controllers/todoController.js';

const router = new Router();

router.route('/todos').get(findAll).post(create);
router.route('/todos/:id').get(findOne).delete(deleteTodo).patch(update);

export default router;
