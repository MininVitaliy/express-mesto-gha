/*const {
  CONFLICT_ERROR,
} = require('../constants');*/

function handlerErrors(err, req, res, next) {
  const { statusCode = 500, message } = err;
  /*if (err.code === 11000) {
    return res.status(CONFLICT_ERROR).json({ message: 'Указанный email уже занят' });
  }*/
  return res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
}

module.exports = {
  handlerErrors,
};
