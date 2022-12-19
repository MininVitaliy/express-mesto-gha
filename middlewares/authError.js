const {
  UNAUTHORIZED,
  ERROR_CODE,
  CONFLICT,
  ERROR_SERVER,
} = require('../constants');

/*function handlerErrors(err, res, next) {
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные в методы создания карточки' });
  } else if (err.name === 'CastError') {
    res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные iD' });
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).json({ message: err.message });
  } else if (err.code === 11000) {
    res.status(CONFLICT).json({ message: 'Указанный email уже занят' });
  } else {
    res.status(ERROR_SERVER).json({ message: 'Произошла ошибка' });
  }
}*/

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = {
  AuthError,
  //handlerErrors,
};
