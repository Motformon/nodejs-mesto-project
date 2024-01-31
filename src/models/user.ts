import { model, Schema } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  // name — имя пользователя, строка от 2 до 30 символов, обязательное поле;
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  // about — **информация о пользователе, строка от 2 до 200 символов, обязательное поле;
  about: {
    type: String,
    required: true,
    maxlength: 200,
    minlength: 2,
  },
  // avatar — ссылка на аватарку, строка, обязательное поле.
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('user', userSchema);
