import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import Card from '../models/card';
import IncorrectDataError from '../errors/IncorrectDataError';
import NotFoundError from '../errors/NotFoundError';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // @ts-ignore
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.link === 'ValidationError' || err.owner === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    return res.send({ data: card });
  })
  .catch(next);

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user._id;
  const { cardId } = req.params;

  const isValidObjectId = Types.ObjectId.isValid(userId) && Types.ObjectId.isValid(cardId);
  if (!isValidObjectId) {
    throw new IncorrectDataError('Переданы некорректные данные для постановки лайка.');
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user._id;
  const { cardId } = req.params;

  const isValidObjectId = Types.ObjectId.isValid(userId) && Types.ObjectId.isValid(cardId);
  if (!isValidObjectId) {
    throw new IncorrectDataError('Переданы некорректные данные для cнятии лайка.');
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch(next);
};
