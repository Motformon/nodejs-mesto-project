import { Request, Response, NextFunction } from 'express';

import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const patchUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  // @ts-ignore
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const patchUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  // @ts-ignore
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
