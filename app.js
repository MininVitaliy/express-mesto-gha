const express = require('express');
const mongoose = require('mongoose');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');
const {
  infoError,
  ERROR_CODE,
  ERROR_SERVER,
  CONFLICT,
  ERROR_NOT_FOUND} = require('./constants');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth }= require('./middlewares/auth');
const { celebrate, Joi, errors} = require('celebrate');
const validator = require('validator');
const { Error } = require('./middlewares/authError');
const routes = require('./routes/routes');


const PORT = 3000;

const app = express();

app.use(express.json());
/*app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), createUser);
app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);
app.use('*', (req, res, next) => next (res.status(ERROR_NOT_FOUND).json({ message: infoError.general.nonExistentPage })));*/
app.use(routes);
app.use(errors());
app.use((err, req, res, next) => {
  /*if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные в методы создания карточки' });
  } else if (err.name === 'CastError'){
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные iD' });
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).json({ message: 'Необходима авторизация' });
  } else if (err.name === 'MongoError' || err.code === 11000) {
    res.status(CONFLICT).json({ message: 'Указанный email уже занят' });
  } else {
    res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }*/
  Error(err, res);
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
