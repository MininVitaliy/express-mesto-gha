const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { handlerErrors } = require('./middlewares/authError');
const routes = require('./routes/routes');
const {CONFLICT} = require("./constants");

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(routes);
app.use(errors());
app.use((err, req, res, next) => {
  handlerErrors(err, req);
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
