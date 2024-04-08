import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'node:http2';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errors, celebrate, Joi } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import NotFoundError from './errors/NotFoundError';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import regexURL from './helpers';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger.requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().min(2).pattern(regexURL),
  }),
}), createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Ошибка 404 роут не найден'));
});

app.use(logger.errorLogger);

app.use(errors());

// здесь обрабатываем все ошибки
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (res.status) {
    res
      .status(statusCode)
      .send({
        message: statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
          ? 'На сервере произошла ошибка'
          : message,
      });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${PORT}/`);
});
