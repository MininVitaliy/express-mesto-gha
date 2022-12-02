const { userNew } = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await userNew.find({});
    if (users === null) {
      return res.status(404).json({ message: 'Пользователи не найдены' });
    }
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const userCreate = await userNew.create(req.body);
    return res.status(200).json(userCreate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные в методы создания пользователя' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userNew.findById(userId);
    if (user === null) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.status(200).json(user);
  } catch (e) {
    if (req.params.userId.length > 24 || req.params.userId.length < 24) {
      return res.status(400).json({ message: 'Переданы некорректные данные iD' });
    }
    return res.status(500).json({ message: 'Произощла ошибка' })
  }
};

const updateProfile = async (req, res) => {
  try {
    const changeProfile = await userNew.findByIdAndUpdate(req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      }, { new: true, runValidators: true },
    );
    return res.status(200).json({ changeProfile });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные в методы обновления профиля пользователя' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const changeProfile = await userNew.findByIdAndUpdate(req.user._id,
      {
        avatar: req.body.avatar,
      }, {new: true, runValidators: true}
    );
    return res.status(200).json(changeProfile);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные в методы обновления аватара пользователя' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
};
