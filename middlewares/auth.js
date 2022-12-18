const jwt = require('jsonwebtoken');
const AuthError = require('./authError')

const secret_key = "25a387bbe1292045e562ecbfe86f77978e6835861a1831711eb3c6b1a27ab956";

function createToken (payload) {
  return jwt.sign(
    payload,
    secret_key,
    { expiresIn: '7d'},
  );
}

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return  res.status(401).send({ message: 'Неправильные почта или пароль' });
    //throw new AuthError('Неправильные почта или пароль');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secret_key);
  } catch (err) {
    return res.status(401).send({ message: 'Неправильные почта или пароль' });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
  createToken,
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzk1ZmFlNDkwY2RiMGRlMWM4ODZjM2QiLCJpYXQiOjE2NzA3Nzc2NjEsImV4cCI6MTY3MTM4MjQ2MX0.QlWnigs7Gqpt_imXgz7sgRF3mSDcL4qXKG1-emi3Urw