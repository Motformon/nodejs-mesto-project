import { model, Schema } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  // name — имя карточки
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  // link — ссылка на картинку
  link: {
    type: String,
    required: true,
  },
  // owner — ссылка на модель автора карточки
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // likes — список лайкнувших пост пользователей
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  // createdAt — дата создания,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
