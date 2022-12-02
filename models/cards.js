const mogoose = require('mongoose');

const cardSchema = new mogoose.Schema ({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mogoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mogoose.Schema.Types.ObjectId,
    required: true,
    default: [],
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const cardNew = mogoose.model('card', cardSchema);
module.exports = {
  cardNew,
}
