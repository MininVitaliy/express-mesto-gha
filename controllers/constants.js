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

module.exports = infoError;
