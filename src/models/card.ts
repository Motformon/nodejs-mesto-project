import { model, Schema } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  // name — имя карточки, строка от 2 до 30 символов, обязательное поле;
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  // link — ссылка на картинку, строка, обязательно поле.
  link: {
    type: String,
    required: true,
  },
  // owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // likes — список лайкнувших пост пользователей, массив ObjectId,
  // по умолчанию — пустой массив (поле default);
  likes: {
    type: [Schema.Types.ObjectId],
    required: true,
    default: [],
  },
  // createdAt — дата создания, тип Date, значение по умолчанию Date.now.
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export default model<ICard>('card', cardSchema);
