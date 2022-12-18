const { ERROR_CODE, CONFLICT, ERROR_SERVER} = require('../constants');

const Error = (err) => {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные в методы создания карточки' });
  } else if (err.name === 'CastError'){
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные iD' });
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).json({ message: 'Необходима авторизация' });
  } else if (err.name === 'MongoError' || err.code === 11000) {
    res.status(CONFLICT).json({ message: 'Указанный email уже занят' });
  } else {
    res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
}

module.exports = {
  Error,
};