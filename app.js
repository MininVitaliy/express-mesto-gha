const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '638661605f100bfa0f871a72',
  };
  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.listen(PORT, function (err) {
  if(err){
    console.log("error while starting server");
  }
  else{
    console.log("server has been started at port " + PORT);
  }
})


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT);
});
