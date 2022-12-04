const { cardNew } = require('../models/cards');
const {
  infoError,
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_NOT_FOUND,
  SUCCESS,
  CREATED,
} = require('../constants');

const createCard = async (req, res) => {
  try {
    const cardUpdate = await cardNew.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(CREATED).json(cardUpdate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(ERROR_CODE).json({ message: infoError.cards.createCard });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await cardNew.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).json(cards);
  } catch (e) {
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardNew.findByIdAndRemove(cardId);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.cards.cardNo });
    }
    return res.status(SUCCESS).json({ message: infoError.cards.cardDelete });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const likeCard = async (req, res) => {
  try {
    const changeLikeCard = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (changeLikeCard === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.cards.cardNo });
    }
    return res.status(SUCCESS).json(changeLikeCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const dislikeCard = async (req, res) => {
  try {
    if (req.user._id === null || req.user._id.length > 24) {
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.cards.cardIdMissing });
    }
    const changeLikeCard = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (changeLikeCard === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: infoError.cards.cardIdMissing });
    }
    return res.status(SUCCESS).json(changeLikeCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
