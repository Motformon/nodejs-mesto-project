import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';

import Card from '../models/card';
import IncorrectDataError from '../errors/IncorrectDataError';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
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
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    } else if(card.owner !== req.user._id) {
      return next(new ForbiddenError('Нет прав.'));
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err instanceof Error.CastError) {
      next(new IncorrectDataError('Переданы некорректные данные для удаления карточки.'));
    } else {
      next(err);
    }
  });

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    // @ts-ignore
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new IncorrectDataError('Переданы некорректные данные для cнятии лайка.'));
      } else {
        next(err);
      }
    });
};
