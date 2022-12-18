const routerUser = require('express').Router();
const {
  getUsers,
  //createUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate')

routerUser.get('/', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUsers);
//routerUser.post('/', createUser);
//routerUser.get('/:userId', getUser);
routerUser.get('/me', celebrate({
  /*params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),*/
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), getUser);
/*, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
})*/
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), updateAvatar);

module.exports = routerUser;
