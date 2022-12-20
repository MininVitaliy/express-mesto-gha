const { cardNew } = require('../models/cards');
const {
  SUCCESS,
  CREATED,
} = require('../constants');
const NotFoundError = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const ErrorCode = require('../errors/ErrorCode');

const createCard = async (req, res, next) => {
  try {
    const cardUpdate = await cardNew.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(CREATED).json(cardUpdate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new ErrorCode('Переданы некорректные данные в методы создания карточки'));
    }
    return next(e);
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await cardNew.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).json(cards);
  } catch (e) {
    return next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const cardInfo = await cardNew.findById(cardId);
    if (cardInfo === null) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (cardInfo.owner.toString() === req.user._id) {
      await cardNew.findByIdAndRemove(cardId);
      return res.status(SUCCESS).json({ message: 'Карточка удалена' });
    }
    return next(new ForbiddenError('Карточку нельзя удалять данным пользователем'));
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new ErrorCode('Переданы некорректные данные iD'));
    }
    return next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card === null) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(SUCCESS).json(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new ErrorCode('Переданы некорректные данные iD'));
    }
    return next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    if (req.user._id === null || req.user._id.length > 24) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    const card = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card === null) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return res.status(SUCCESS).json(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new ErrorCode('Переданы некорректные данные iD'));
    }
    return next(e);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
