const {celebrate, Joi} = require("celebrate");
const validator = require("validator");
const { login, createUser } = require("../controllers/users");
const {auth} = require("../middlewares/auth");
const routerUser = require("./users");
const routerCard = require("./cards");
const {ERROR_NOT_FOUND, infoError} = require("../constants");
const express = require("express");
const app = express();

app.post('/signin', celebrate({
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
app.use('*', (req, res, next) => next (res.status(ERROR_NOT_FOUND).json({ message: infoError.general.nonExistentPage })));

module.exports = app;