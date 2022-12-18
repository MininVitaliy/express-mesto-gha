const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED,
} = require('../constants');

const secret_key = "25a387bbe1292045e562ecbfe86f77978e6835861a1831711eb3c6b1a27ab956";

function createToken (payload) {
  return jwt.sign(
    payload,
    secret_key,
    { expiresIn: '7d'},
  );
};

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return  res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secret_key);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
  createToken,
};
