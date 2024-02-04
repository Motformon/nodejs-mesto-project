import { Router } from 'express';
import {
  createUser, getUser, getUsers, patchUserProfile, patchUserAvatar,
} from '../controllers/users';

const router = Router();

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает пользователя по _id
router.get('/:id', getUser);
// создаёт пользователя
router.post('/', createUser);
// обновляет профиль
router.patch('/me', patchUserProfile);
// обновляет аватар
router.patch('/me/avatar', patchUserAvatar);

export default router;
