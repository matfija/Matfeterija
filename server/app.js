const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const expressJwt = require('express-jwt');
const cookieParser = require('cookie-parser')

// Ucitavanje svih rutera
const indexAPIRoutes = require('./index/indexAPI');
const loginAPIRoutes = require('./login/loginAPI');
const userAPIRoutes = require('./user/userAPI');
const postAPIRoutes = require('./post/postAPI');
const commAPIRoutes = require('./comm/commAPI');

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

// Parsiranje kolacica
app.use(cookieParser());

// Regulisanje CORS-a
app.use(cors());

// Definisanje osnovnih pravila za rutiranje
app.use('/', indexAPIRoutes);
app.use('/login', loginAPIRoutes);

// Privremena funkcionalnost starog servera /////
app.use('/poruke', require('./poruke'));
/////////////////////////////////////////////////

// Javni kljuc za RSA enkripciju
const RSA_PUBLIC_KEY = fs.readFileSync('../data/public.key');

// Funkcija srednjeg sloja za potvrdu
const autentikacija = expressJwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ['RS256'],
  // Dohvatanje zetona iz kolacica
  getToken: req => req.cookies['MATFETERIJA']
});

// Definisanje zasticenih pravila za rutiranje
app.use('/user', autentikacija, userAPIRoutes);
app.use('/post', autentikacija, postAPIRoutes);
app.use('/comm', autentikacija, commAPIRoutes);

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
