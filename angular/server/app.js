const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Ucitavanje svih rutera
const indexAPIRoutes = require('./index/indexAPI');

// Kreiranje Express.js aplikacije
const app = express();

// Konekcija na MongoDB SUBP
mongoose.connect('mongodb://localhost:27017/matfeterija', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parsiranje tela zahteva za dva formata:
// 1) application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// 2) application/json
app.use(bodyParser.json({}));

// Regulisanje CORS-a
app.use(cors());

// Definisanje osnovnih pravila za rutiranje
app.use('/', indexAPIRoutes);

// Obrada zahteva van navedenih pravila
app.use((req, res, next) => {
  const error = new Error('Server ne podrzava ovakav zahtev.');
  error.status = 405;
  next(error);
});

// Obrada potencijalnih gresaka prilikom rada
app.use((error, req, res) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    error: {
      message: error.message,
      status: statusCode,
      stack: error.stack
    },
  });
});

// Izvozenje Express.js aplikacije radi pokretanja servera
module.exports = app;
