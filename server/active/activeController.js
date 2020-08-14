'use strict';

const Active = require('./activeModel');

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
      throw new Error('Neprijavljen korisnik!');
    }
    next();
  } catch (err) {
    next(err);
  }
}
