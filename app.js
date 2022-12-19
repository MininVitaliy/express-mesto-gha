const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
//const { handlerErrors } = require('./middlewares/authError');
const routes = require('./routes/routes');
const {CONFLICT} = require("./constants");

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(routes);
app.use(errors());
/*app.use((err, req, res, next) => {
  handlerErrors();
});*/

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
   return res.status(CONFLICT).json({ message: 'Указанный email уже занят' });
  }
  return res.status(statusCode).send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
