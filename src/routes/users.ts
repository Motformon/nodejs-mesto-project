import { Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/users';

const router = Router();

// GET /users — возвращает всех пользователей
router.get('/', getUsers);
// GET /users/:userId - возвращает пользователя по _id
router.get('/:id', getUser);
// POST /users — создаёт пользователя
router.post('/', createUser);

export default router;
