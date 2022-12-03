const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '638661605f100bfa0f871a72',
  };
  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Нет такой стараницы приложения' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
