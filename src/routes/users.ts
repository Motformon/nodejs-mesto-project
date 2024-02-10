import { Router } from 'express';
import {
  getUser, getUsers, patchUserProfile, patchUserAvatar, getUserMe,
} from '../controllers/users';

const router = Router();

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает пользователя по _id
router.get('/:id', getUser);
// возвращает информацию о текущем пользователе
router.get('/me', getUserMe);
// обновляет профиль
router.patch('/me', patchUserProfile);
// обновляет аватар
router.patch('/me/avatar', patchUserAvatar);

export default router;
