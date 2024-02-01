import { Request, Response } from 'express';

import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  // @ts-ignore
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const likeCard = (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const dislikeCard = (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
