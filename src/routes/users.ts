import { Router } from 'express';
import {
  createUser, getUser, getUsers, patchUserProfile, patchUserAvatar,
} from '../controllers/users';

const router = Router();

// GET /users — возвращает всех пользователей
router.get('/', getUsers);
// GET /users/:userId - возвращает пользователя по _id
router.get('/:id', getUser);
// POST /users — создаёт пользователя
router.post('/', createUser);
// PATCH /users/me — обновляет профиль
router.patch('/me', patchUserProfile);
// PATCH /users/me/avatar — обновляет аватар
router.patch('/me/avatar', patchUserAvatar);

export default router;
