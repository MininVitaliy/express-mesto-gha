const express = require('express');
const mongoose = require('mongoose');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');
const { infoError, UNAUTHORIZED, ERROR_CODE, ERROR_SERVER} = require('./constants');
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth }= require('./middlewares/auth');

const PORT = 3000;

const app = express();

app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);;
app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);
app.use('*', (req, res) => res.status(UNAUTHORIZED).json({ message: infoError.general.nonExistentPage }));
//app.use((err, req, res, next) => {
  //res.status(err.statusCode).send({ message: err.message });
  //res.status(ERROR_CODE).send({ message: err });
  //res.send({ message: err.message });

//});

/*app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).json({ message: infoError.cards.createCard });
  } else {
    next(err)
  }
});*/
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные в методы создания карточки' });
  } else if (err.name === 'CastError'){
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные iD' });
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).json({ message: 'Необходима авторизация' });
  } else if (err.name === 'MongoError' || err.code === 11000) {
    res.status(409).json({ message: 'Указанный email уже занят' });
  } else {
    res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
