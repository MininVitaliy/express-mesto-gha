const { cardNew } = require('../models/cards');

const createCard = async (req, res) => {
  try {
    const cardUpdate = await cardNew.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(200).json(cardUpdate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные в методы создания карточки' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await cardNew.find({});
    if (cards === null) {
      return res.status(404).json({ message: 'Карточки не найдены' });
    }
    return res.status(200).json(cards);
  } catch (e) {
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardNew.findByIdAndRemove(cardId);
    if (card === null) {
      return res.status(404).json({ message: 'Нет карточки' });
    }
    return res.status(200).json({ message: `Карточка удалена ${cardId}` });
  } catch (e) {
    if (req.params.cardId.length > 24 || req.params.cardId.length < 24) {
      return res.status(400).json({ message: 'Переданы некорректные данные iD карточки' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const changeLikeCard = await cardNew.findByIdAndUpdate(req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      }, { new: true },
    );
    if (changeLikeCard === null) {
      return res.status(404).json({ message: 'Карточки не найдены' });
    }
    return res.status(200).json(changeLikeCard);
  } catch (e) {
    if (req.params.cardId.length > 24 || req.params.cardId.length < 24) {
      return res.status(400).json({ message: 'Переданы некорректные данные iD карточки' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    if (req.user._id === null || req.user._id.length > 24) {
      return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
    }
    const changeLikeCard = await cardNew.findByIdAndUpdate(req.params.cardId,
      {
        $pull: { likes: req.user._id },
      }, { new: true },
    );
    if (changeLikeCard === null) {
      return res.status(404).json({ message: 'Передан несуществующий _id карточки' });
    }
    return res.status(200).json(changeLikeCard);
  } catch (e) {
    if (req.params.cardId.length > 24 || req.params.cardId.length < 24) {
      return res.status(400).json({ message: 'Переданы некорректные данные iD карточки' });
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
