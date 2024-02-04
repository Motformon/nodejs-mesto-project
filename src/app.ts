import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'node:http2';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: '65ba4beb75e8ca90f38c1151',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

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
