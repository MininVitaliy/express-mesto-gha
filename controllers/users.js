const { userNew } = require('../models/users');
const {
  infoError,
  ERROR_NOT_FOUND,
  ERROR_CODE,
  ERROR_SERVER,
  SUCCESS,
  CREATED,
} = require('../constants');

const getUsers = async (req, res) => {
  try {
    const users = await userNew.find({});
    return res.status(SUCCESS).json(users);
  } catch (e) {
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const createUser = async (req, res) => {
  try {
    const userCreate = await userNew.create(req.body);
    return res.status(CREATED).json(userCreate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.users.createUser });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userNew.findById(userId);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.users.userNo });
    }
    return res.status(SUCCESS).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const updateProfile = async (req, res) => {
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
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.users.userUpdate });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const updateAvatar = async (req, res) => {
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
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.users.userUpdateAvatar });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
};
