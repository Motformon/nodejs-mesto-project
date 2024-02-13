import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';

import User from '../models/user';
import NotFoundError from '../errors/NotFoundError';
import IncorrectDataError from '../errors/IncorrectDataError';
import UnauthorizedError from '../errors/UnauthorizedError';
import ConflictError from '../errors/ConflictError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findOne({
  _id: req.params.id,
  owner: req?.user?._id,
}).then((user) => {
  if (!user) {
    return next(new NotFoundError('Нет пользователя с таким id'));
  }
  return res.send({ data: user });
})
  .catch((err) => {
    if (err instanceof Error.CastError) {
      next(new IncorrectDataError('Переданы некорректные данные для получения пользователя.'));
    } else {
      next(err);
    }
  });

export const getUserMe = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req?.user?._id)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Нет пользователя с таким id'));
    }
    return res.send({
      data: {
        avatar: user?.avatar, name: user?.name, about: user?.about, email: user?.email,
      },
    });
  })
  .catch((err) => {
    if (err instanceof Error.CastError) {
      next(new IncorrectDataError('Переданы некорректные данные для получения информации о пользователе.'));
    } else {
      next(err);
    }
  });

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Такой email уже зарегистрирован.'));
        } else if (err instanceof Error.ValidationError) {
          next(new IncorrectDataError('Переданы некорректные данные при создании пользователя.'));
        } else {
          next(err);
        }
      }));
};

export const patchUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

export const patchUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Нет пользователя с таким id'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new UnauthorizedError('Необходима авторизация'));
      } else {
        next(err);
      }
    });
};
