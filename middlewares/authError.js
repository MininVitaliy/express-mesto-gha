const {
  UNAUTHORIZED,
  ERROR_CODE,
  CONFLICT,
  ERROR_SERVER,
} = require('../constants');

function handlerErrors(err, res) {
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
   return res.status(CONFLICT).json({ message: 'Указанный email уже занят' });
  }
  return res.status(statusCode).send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = {
  AuthError,
  handlerErrors,
};
