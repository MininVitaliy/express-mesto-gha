const { cardNew } = require('../models/cards');
const infoError = require('./constants');

const createCard = async (req, res) => {
  try {
    const cardUpdate = await cardNew.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(201).json(cardUpdate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ message: infoError.cards.createCard });
    }
    return res.status(500).json({ message: infoError.general.error });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await cardNew.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (e) {
    return res.status(500).json({ message: infoError.general.error });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardNew.findByIdAndRemove(cardId);
    if (card === null) {
      return res.status(404).json({ message: infoError.cards.cardNo });
    }
    return res.status(200).json({ message: infoError.cards.cardDelete });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(500).json({ message: infoError.general.error });
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
      return res.status(404).json({ message: infoError.cards.cardNo });
    }
    return res.status(200).json(changeLikeCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(500).json({ message: infoError.general.error });
  }
};

const dislikeCard = async (req, res) => {
  try {
    if (req.user._id === null || req.user._id.length > 24) {
      return res.status(404).json({ message: infoError.cards.cardIdMissing });
    }
    const changeLikeCard = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (changeLikeCard === null) {
      return res.status(404).json({ message: infoError.cards.cardIdMissing });
    }
    return res.status(200).json(changeLikeCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: infoError.general.cardIdUncorrected });
    }
    return res.status(500).json({ message: infoError.general.error });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
