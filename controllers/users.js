const bcrypt = require('bcryptjs');
const { userNew } = require('../models/users');
const {
  infoError,
  ERROR_NOT_FOUND,
  SUCCESS,
  CREATED,
} = require('../constants');
const { createToken } = require('../middlewares/auth');
const NotFoundError = require("../error/ErrorNotFound");

const getUsers = async (req, res, next) => {
  try {
    const users = await userNew.find({});
    return res.status(SUCCESS).json(users);
  } catch (e) {
    return next(e);
  }
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userNew.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).json({
      _id: user._id,
      name: user.name,
      about: user. about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      next(err);
    });
};

const getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userNew.findById(userId);
    if (user === null) {
      //return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь не найден' });
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json({ user });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await userNew.findById(_id);
    return res.status(SUCCESS).json({ user });
  } catch (e) {
    return next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const changeProfile = await userNew.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    );
    if (changeProfile === null) {
      //return res.status(ERROR_NOT_FOUND).json({ message: infoError.users.userNo });
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json({ changeProfile });
  } catch (e) {
    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const changeProfile = await userNew.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true },
    );
    if (changeProfile === null) {
      //return res.status(ERROR_NOT_FOUND).json({ message: infoError.users.userNo });
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json(changeProfile);
  } catch (e) {
    return next(e);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userNew.findUserByCredentials(email, password)
    .then((user) => {
      const token = createToken({ _id: user._id });
      res.status(SUCCESS).send({ token });
    })
    .catch(() => {
      const err = new Error('Необходима авторизация');
      err.statusCode = 401;
      next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
  login,
  getUserId,
};
