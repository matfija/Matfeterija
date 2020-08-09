const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Model korisnika u bazi
const User = require('../user/userModel');

// Privatni kljuc za RSA enkripciju
const RSA_PRIVATE_KEY = fs.readFileSync('../data/private.key');

// Funkcija za dohvatanje kredencijala
const dohvatiKredencijale = (req, status) => {
  // Provera polja koje sadrzi ime na Alasu
  const alas = req.body.alas;
  if (!alas || !alas.match(/^(a[fi]|m[lmrnvai])([0-1][0-9])1?[0-9]{3}$/)) {
    res.status(status).json({error: 'fali alas'});
    return null;
  }

  // Provera polja koje sadrzi lozinku
  const password = req.body.password;
  if (!password || password.length < 8) {
    res.status(status).json({error: 'fali password'});
    return null;
  }

  // Vracanje rezultata po uspehu
  return [alas, password];
}

module.exports.registrujSe = async (req, res, next) => {
  // Dohvatanje kredencijala iz tela zahteva,
  // pri cemu je neuspeh 400 BAD REQUEST
  const kredencijali = dohvatiKredencijale(req, 400);
  if (!kredencijali) {
    return;
  }
  const [alas, password] = kredencijali;

  try {
    // Hesiranje lozinke pre cuvanja u bazi
    const hashPass = await bcrypt.hash(password, 12);

    // Cuvanje korisnika u bazi
    const korisnik = new User({
      _id: new mongoose.Types.ObjectId,
      alas,
      password: hashPass
    });

    // Perzistiranje korisnika u bazi
    const korisnikObj = await korisnik.save();

    // Uspesna registracija je 201 CREATED
    res.status(201).json(korisnikObj);
  } catch (err) {
    next(err);
  }
};

module.exports.prijaviSe = async (req, res, next) => {
  // Dohvatanje kredencijala iz tela zahteva,
  // pri cemu je neuspeh 401 UNAUTHORIZED
  const kredencijali = dohvatiKredencijale(req, 401);
  if (!kredencijali) {
    return;
  }
  const [alas, password] = kredencijali;

  try {
    // Provera trazenog korisnika u bazi,
    // pri cemu je neuspeh 401 UNAUTHORIZED
    const korisnik = await User.findOne({alas}).exec();
    if (!korisnik) {
      res.status(401).json({error: 'nepostojeci korisnik'});
    } else if (!await bcrypt.compare(password, korisnik.password)) {
      res.status(401).json({error: 'los password'});
    } else {
      const id = korisnik._id.toString();

      // Potpisivanje JWT zetona
      const jwtToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 120, // Traje dva minuta zasad
        subject: id
      });

      // Slanje kolacica sa zetonom
      res.cookie('MATFETERIJA', jwtToken, { httpOnly: true/*, secure: true*/ });

      // Uspesna prijava je 200 OK
      res.status(200).json(korisnik);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.potvrdiSe = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'potvrdiSe'});
  } catch (err) {
    next(err);
  }
};
