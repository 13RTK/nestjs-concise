import { Router } from 'express';
import { getHello } from '../controllers/appController.js';

const router = new Router();

router.route('/').get(getHello);

export default router;
