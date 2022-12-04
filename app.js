const express = require('express');
const mongoose = require('mongoose');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');
const infoError = require('./controllers/constants');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '638661605f100bfa0f871a72',
  };
  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res) => res.status(404).json({ message: infoError.general.nonExistentPage }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
