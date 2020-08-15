'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const expressJwt = require('express-jwt');
const cookieParser = require('cookie-parser')

const activeAPI = require('./active/activeAPI');

// Ucitavanje svih rutera
const indexAPIRoutes = require('./index/indexAPI');
const activeAPIRoutes = activeAPI.router;
const loginAPIRoutes = require('./login/loginAPI');
const userAPIRoutes = require('./user/userAPI');
const postAPIRoutes = require('./post/postAPI');
const commAPIRoutes = require('./comm/commAPI');

// Kreiranje Express.js aplikacije
const app = express();

// Konekcija na MongoDB SUBP
mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/matfeterija?replicaSet=rs', {
  autoIndex: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Parsiranje tela zahteva za dva formata:
// 1) application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '10mb'
  })
);
// 2) application/json
app.use(bodyParser.json({
  limit: '10mb'
}));

// Parsiranje kolacica
app.use(cookieParser());

// Regulisanje CORS-a
app.use(cors({
  origin: true,
  credentials: true
}));

// Podesavanje pogleda
app.set('view engine', 'ejs');
app.set('views', 'index/');

// Definisanje osnovnih pravila za rutiranje
app.use('/', indexAPIRoutes);
app.use('/login', loginAPIRoutes);

// Privremena funkcionalnost starog servera /////
app.use('/poruke', require('./poruke'));
/////////////////////////////////////////////////

// Javni kljuc za RSA enkripciju
const RSA_PUBLIC_KEY = fs.readFileSync('../data/public.key');

// Funkcija srednjeg sloja za potvrdu
const autentifikacija = expressJwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ['RS256'],
  // Dohvatanje zetona iz kolacica
  getToken: req => req.cookies['MATFETERIJA']
});

// Provera aktivnosti prijave
const { prijavljen } = activeAPI;

// Definisanje zasticenih pravila za rutiranje
app.use('/active', autentifikacija, prijavljen, activeAPIRoutes)
app.use('/user', autentifikacija, prijavljen, userAPIRoutes);
app.use('/post', autentifikacija, prijavljen, postAPIRoutes);
app.use('/comm', autentifikacija, prijavljen, commAPIRoutes);

// Obrada zahteva van navedenih pravila
app.use((req, res, next) => {
  const err = new Error('Server ne podrzava ovakav zahtev.');
  err.status = 405;
  next(err);
});

// Obrada potencijalnih gresaka prilikom rada
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
      stack: err.stack
    },
  });
});

// Izvozenje Express.js aplikacije radi pokretanja servera
module.exports = app;
