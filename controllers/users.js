const { userNew } = require('../models/users');
const {
  infoError,
  ERROR_NOT_FOUND,
  ERROR_CODE,
  ERROR_SERVER,
  SUCCESS,
  CREATED,
} = require('../constants');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../middlewares/authError');

const { createToken } = require('../middlewares/auth')

const getUsers = async (req, res, next) => {
  try {
    const users = await userNew.find({});
    return res.status(SUCCESS).json(users);
  } catch (e) {
    next(e)
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
    .then(() => res.status(CREATED).json({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      next(err)
    });
};

const getUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const user = await userNew.findById(userId);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({message: 'Пользователь не найден'});
    }
    return res.status(SUCCESS).json({ user });
  } catch (err) {
    next(err)
  }
}

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log(req.user)
    const user = await userNew.findById(_id)
    //if (user === null) {
      //return new NotFoundError('Пользователь не найден')
    //}
    return  res.status(SUCCESS).json({ user });
  } catch (e) {
    next(e);
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
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.users.userNo });
    }
    return res.status(SUCCESS).json({ changeProfile });
  } catch (e) {
    next(e)
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
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.users.userNo });
    }
    return res.status(SUCCESS).json(changeProfile);
  } catch (e) {
    next(e)
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return  userNew.findUserByCredentials(email, password)
    .then((user) => {
      const token = createToken({ _id: user._id });
      res.status(SUCCESS).send({ token });
    })
    .catch((e) => {
      next(e);
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
