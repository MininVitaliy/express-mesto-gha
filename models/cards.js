const mogoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mogoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mogoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mogoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const cardNew = mogoose.model('card', cardSchema);
module.exports = {
  cardNew,
};
