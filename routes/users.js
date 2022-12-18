const routerUser = require('express').Router();
const {
  getUsers,
  //createUser,
  getUser,
  updateProfile,
  updateAvatar,
  getUserId,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate')

routerUser.get('/', getUsers);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
}), getUserId);
routerUser.get('/me', getUser);
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
