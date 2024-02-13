import { Router } from 'express';

import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

// возвращает все карточки
router.get('/', getCards);
// создаёт карточку
router.post('/', createCard);
// удаляет карточку по идентификатору
router.delete('/:cardId', deleteCard);
// поставить лайк карточке
router.put('/:cardId/likes', likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', dislikeCard);

export default router;
