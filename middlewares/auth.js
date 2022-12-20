const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const secretKey = '25a387bbe1292045e562ecbfe86f77978e6835861a1831711eb3c6b1a27ab956';

function createToken(payload) {
  return jwt.sign(
    payload,
    secretKey,
    { expiresIn: '7d' },
  );
}

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
  createToken,
};
