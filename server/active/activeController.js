'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const Active = require('./activeModel');

// Privatni kljuc za RSA enkripciju
const RSA_PRIVATE_KEY = fs.readFileSync('../data/private.key');

module.exports.dohvatiAktivne = async (req, res, next) => {
  try {
    // Dohvatanje aktivnih korisnika
    const aktivni = await Active.find();
    res.status(200).json(aktivni);
  } catch (err) {
    next(err);
  }
}

module.exports.odjaviSe = async (req, res, next) => {
  try {
    // Dohvatanje identifikatora korisnika
    const id = req.user.sub;

    // Izbacivanje iz spiska prijavljenih
    const korisnik = await Active.findByIdAndRemove(id);

    // Uspesna odjava je 200 OK
    res.status(200).json(korisnik);
  } catch (err) {
    next(err);
  }
}

module.exports.prijavljen = async (req, res, next) => {
  try {
    // Dohvatanje identifikatora korisnika
    const id = req.user.sub;

    // Greska ako nije aktivan
    const korisnik = await Active.findById(id);
    if (!korisnik) {
      res.status(401).json({error: 'Neprijavljen korisnik'});
      return;
    }

    // Inace osvezavanje aktivnosti
    korisnik.lastAction = Date.now();
    await korisnik.save();

    // Osvezavanje i JWT zetona/tokena
    const jwtToken = jwt.sign({}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: 1800, // 30 min
      subject: id
    });

    // Osvezavanje i kolacica sa zetonom
    res.cookie('MATFETERIJA', jwtToken, { httpOnly: true, secure: true });

    next();
  } catch (err) {
    next(err);
  }
}
