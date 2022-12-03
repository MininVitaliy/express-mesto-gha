const routerUser = require('express').Router();
const {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.post('/', createUser);
routerUser.get('/:userId', getUser);
routerUser.patch('/me', updateProfile);
routerUser.patch('/me/avatar', updateAvatar);

module.exports = routerUser;
