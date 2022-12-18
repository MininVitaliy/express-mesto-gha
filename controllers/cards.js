const { cardNew } = require('../models/cards');
const {
  ERROR_NOT_FOUND,
  SUCCESS,
  CREATED,
  FORBIDDEN,
} = require('../constants');

const createCard = async (req, res, next) => {
  try {
    const cardUpdate = await cardNew.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    return res.status(CREATED).json(cardUpdate);
  } catch (e) {
    next(e);
  }
};

const getCards = async (req, res, next) => {
  try {
    const cards = await cardNew.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).json(cards);
  } catch (e) {
    next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const cardInfo = await cardNew.findById(cardId);
    if (cardInfo === null) {
      return res.status(ERROR_NOT_FOUND).json({message: 'Карточка не найдена'});
    }
    if (cardInfo.owner.toString() === req.user._id ) {
      const card = await cardNew.findByIdAndRemove(cardId);
      return res.status(SUCCESS).json({message: 'Карточка удалена'});
    } else {
      return res.status(FORBIDDEN).json({message: "Карточку нельзя удалять данным пользователем"});
    }
  } catch (e) {
    next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const changeLikeCard = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (changeLikeCard === null) {
      return res.status(ERROR_NOT_FOUND).json({ message:'Карточка не найдена' });
    }
    return res.status(SUCCESS).json(changeLikeCard);
  } catch (e) {
    next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    if (req.user._id === null || req.user._id.length > 24) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }
    const changeLikeCard = await cardNew.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (changeLikeCard === null) {
      return  res.status(ERROR_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }
    return res.status(SUCCESS).json(changeLikeCard);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
