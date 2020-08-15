'use strict';

const Comm = require('./commModel');

module.exports.dohvatiKomentar = async (req, res, next) => {
  try {
    // Dohvatanje komentara po ID-ju
    const id = req.params.commId;
    const komentar = await Comm.findById(id);
    if (!komentar) {
      res.status(404).json({error: 'Nepostojeci komentar'});
      return;
    }

    // Uspesno dohvatanje je 200 OK
    res.status(200).json(komentar);
  } catch (err) {
    next(err);
  }
};

module.exports.obrisiKomentar = async (req, res, next) => {
  try {
    // Dohvatanje trazenog komentara
    const idKomentara = req.params.commId;
    const komentar = await Comm.findById(idKomentara);
    if (!komentar) {
      res.status(404).json({error: 'Nepostojeci komentar'});
      return;
    }

    // Provera autora komentara, tudji
    // komentar je 401 UNAUTHORIZED
    const idKorisnika = req.user.sub;
    if (komentar.user != idKorisnika) {
      res.status(401).json({error: 'Nije autor komentara'});
      return;
    }

    // Brisanje komentara
    const obrisan = await komentar.remove();

    // Uspesno brisanje je 200 OK
    res.status(200).json(obrisan);
  } catch (err) {
    next(err);
  }
};
