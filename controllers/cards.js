const { cardNew } = require('../models/cards');
const {
  infoError,
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_NOT_FOUND,
  SUCCESS,
  CREATED,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../constants');
//const { userNew } = require('../models/users');

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
    next(e)
    //return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    console.log(cardId)
    const cardInfo = await cardNew.findById(cardId);
    console.log(req.user._id)
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
    next(e)
    //if (e.name === 'CastError') {
      //return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    //}
    //return res.status(ERROR_SERVER).json({ message: infoError.general.error });
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
    next(e)
    //if (e.name === 'CastError') {
      //return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    //}
    //return res.status(ERROR_SERVER).json({ message: infoError.general.error });
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
    next(e)
    //if (e.name === 'CastError') {
      //return res.status(ERROR_CODE).json({ message: infoError.general.cardIdUncorrected });
    //}
    //return res.status(ERROR_SERVER).json({ message: infoError.general.error });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
