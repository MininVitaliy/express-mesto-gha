const bcrypt = require('bcryptjs');
const { userNew } = require('../models/users');
const {
  SUCCESS,
  CREATED,
} = require('../constants');
const { createToken } = require('../middlewares/auth');
const NotFoundError = require('../errors/ErrorNotFound');
const ConflictError = require('../errors/ConflictError');
const ErrorCode = require('../errors/ErrorCode');

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
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorCode('Переданы некорректные данные в методы создания пользовтаеля'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Указанный email уже занят'));
      }
      return next(err);
    });
};

const getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userNew.findById(userId);
    if (user === null) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json({ user });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданы некорректные данные iD'));
    }
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await userNew.findById(_id);
    if (user === null) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json({ user });
  } catch (e) {
    return next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await userNew.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    );
    if (profile === null) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json({ profile });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new ErrorCode('Переданы некорректные данные'));
    }
    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const profile = await userNew.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true },
    );
    if (profile === null) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(SUCCESS).json(profile);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new ErrorCode('Переданы некорректные данные'));
    }
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
    .catch((err) => {
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
