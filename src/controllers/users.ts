import { Request, Response, NextFunction } from 'express';

import User from '../models/user';
import NotFoundError from '../errors/NotFoundError';
import IncorrectDataError from '../errors/IncorrectDataError';

const notFoundUserError = (user: any) => {
  if (!user) {
    throw new NotFoundError('Нет пользователя с таким id');
  }
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.id)
  .then((user) => {
    notFoundUserError(user);
    return res.send({ data: user });
  })
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError' || err.avatar === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

export const patchUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  // @ts-ignore
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      notFoundUserError(user);
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

export const patchUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  // @ts-ignore
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      notFoundUserError(user);
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.avatar === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};
