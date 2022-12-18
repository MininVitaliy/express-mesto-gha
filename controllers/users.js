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
    //return res.status(ERROR_SERVER).json({ message: infoError.general.error });
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
      /*if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).json({ message: infoError.users.createUser });
        return;
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        res.status(409).json({ message: 'Указанный email уже занят' });
      } else res.status(ERROR_SERVER).json({ message: infoError.general.error });*/
      next(err)
    });
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log(req)
    const user = await userNew.findById(_id)
    //const { name, about, avatar } = user;
     if (user === null) {
       return res.status(404).json({message: 'Пользователь не найден'});
       //return res.status(SUCCESS).json({ name, about, avatar });
     }
    //orFail(new NotFoundError('Пользователь не найден'));

    //return  res.status(SUCCESS).json({ name, about, avatar });
    return  res.status(SUCCESS).json({ user });
  } catch (e) {
    /*if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
    */
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
    /*if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.users.userUpdate });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }*/
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
    /*if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.users.userUpdateAvatar });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }*/
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password)
  return  userNew.findUserByCredentials(email, password)
    .then((user) => {
      /*const token = jwt.sign(
        { _id: user._id },
        '25a387bbe1292045e562ecbfe86f77978e6835861a1831711eb3c6b1a27ab956',
        { expiresIn: '7d'},
      );*/
      const token = createToken({ _id: user._id });
      res.status(200).send({ token });
    })
    .catch((e) => {
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
};
