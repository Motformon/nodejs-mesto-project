import { Router } from 'express';
import { getCards, createCard, deleteCard } from '../controllers/cards';

const router = Router();

// GET /cards  — возвращает все карточки
router.get('/', getCards);
// POST /cards —  создаёт карточку
router.post('/', createCard);
// DELETE  /cards/:cardId - удаляет карточку по идентификатору
router.delete('/:id', deleteCard);
// PUT /cards/:cardId/likes — поставить лайк карточке
// router.patch('/:id/likes', createCard);
// DELETE /cards/:cardId/likes — убрать лайк с карточки
// router.delete('/:id/likes', deleteCard);

export default router;
