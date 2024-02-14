import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUser, getUsers, patchUserProfile, patchUserAvatar, getUserMe,
} from '../controllers/users';
import regexURL from '../helpers';

const router = Router();

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает информацию о текущем пользователе
router.get('/me', getUserMe);
// возвращает пользователя по _id
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);
// обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), patchUserProfile);
// обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).pattern(regexURL),
  }),
}), patchUserAvatar);

export default router;
