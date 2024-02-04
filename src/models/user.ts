import { model, Schema } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  // name — имя пользователя
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  // about — информация о пользователе
  about: {
    type: String,
    required: true,
    maxlength: 200,
    minlength: 2,
  },
  // avatar — ссылка на аватарку
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('user', userSchema);
