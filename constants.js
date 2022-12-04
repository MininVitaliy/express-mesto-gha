const infoError = {
  cards: {
    createCard: 'Переданы некорректные данные в методы создания карточки',
    cardDelete: 'Карточка удалена',
    cardNo: 'Карточка не найдена',
    cardIdMissing: 'Передан несуществующий _id карточки',
  },
  users: {
    createUser: 'Переданы некорректные данные в методы создания пользователя',
    userNo: 'Пользователь не найден',
    userUpdate: 'Переданы некорректные данные в методы обновления профиля пользователя',
    userUpdateAvatar: 'Переданы некорректные данные в методы обновления аватара пользователя',
  },
  general: {
    error: 'Произошла ошибка',
    cardIdUncorrected: 'Переданы некорректные данные iD',
    nonExistentPage: 'Нет такой стараницы приложения',
  },
};

const SUCCESS = 200;
const CREATED = 201;
const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

module.exports = {
  infoError,
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS,
  CREATED,
};
