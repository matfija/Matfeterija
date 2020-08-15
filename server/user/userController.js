'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Active = require('../active/activeModel');
const User = require('./userModel');

module.exports.dohvatiSveKorisnike = async (req, res, next) => {
  try {
    // Dohvatanje svih korisnika
    const korisnici = await User.find();
    res.status(200).json(korisnici);
  } catch (err) {
    next(err);
  }
};

module.exports.azurirajSe = async (req, res, next) => {
  try {
    // Dohvatanje po identifikatoru zahteva
    const id = req.user.sub;
    const korisnik = await User.findById(id);

    // Promena lozinke korisnika
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;
    if (oldPass && newPass) {
      // Mora da postoji razlika,
      // inace je 400 BAD REQUEST
      if (oldPass === newPass) {
        res.status(400).json({error: 'Iste lozinke'});
        return;
      }

      // Stara lozinka mora da se poklapa,
      // inace je 400 UNAUTHORIZED
      if (!await bcrypt.compare(oldPass, korisnik.password)) {
        res.status(400).json({error: 'Neispravna lozinka'});
        return;
      }

      // Nova lozinka mora biti duzine makar
      // osam, inace je 400 BAD REQUEST
      if (newPass.length < 8) {
        res.status(400).json({error: 'Prekratka lozinka'});
        return;
      }

      // Hesiranje i cuvanje nove lozinke
      const password = await bcrypt.hash(newPass, 12);
      korisnik.password = password;
    }

    // Promena imena za prikaz
    const display = req.body.display;
    if (display) {
      korisnik.display = display;
    }

    // Promena opisa korisnika
    const description = req.body.description;
    if (description) {
      korisnik.description = description;
    }

    // Promena avatara
    const avatar = req.body.avatar;
    if (avatar) {
      korisnik.avatar = avatar;
    }

    // Perzistiranje izmena u bazi
    const noviKorisnik = await korisnik.save();

    // Uspesno azuriranje je 200 OK
    res.status(200).json(noviKorisnik);
  } catch (err) {
    next(err);
  }
};

module.exports.obrisiSe = async (req, res, next) => {
  try {
    // Brisanje po indentifikatoru zahteva; namerno
    // nije findByIdAndRemove zbog pre middleware-a
    const id = req.user.sub;
    const korisnik = await User.findById(id);

    // Transakciono brisanje korisnika, kako bi
    // se pocistili i svi njegovi pratioci
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await korisnik.remove({ session });

      // Brisanje svih pracenja povezanih
      // sa obrisanim korisnikom
      await User.updateMany({},
        { $pull: { following: id } },
        { session }
      );

      // Uspesno brisanje je 200 OK
      res.status(200).json(korisnik);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};

module.exports.dohvatiKorisnika = async (req, res, next) => {
  try {
    // Dohvatanje korisnika po ID-ju
    const id = req.params.userId;
    const korisnik = await User.findById(id);
    if (!korisnik) {
      res.status(404).json({error: 'Nepostojeci korisnik'});
      return;
    }

    // Uspesno dohvatanje je 200 OK
    res.status(200).json(korisnik);
  } catch (err) {
    next(err);
  }
};

module.exports.zapratiKorisnika = async (req, res, next) => {
  try {
    // Dohvatanje identifikatora
    const koId = req.user.sub;
    const kogaId = req.params.userId;

    // Nije moguce pratiti samog sebe,
    // to je 400 BAD REQUEST
    if (koId === kogaId) {
      res.status(400).json({error: 'Nemoguce pracenje'});
      return;
    }

    // Broj pracenih pre dodavanja
    const broj = (await User.findById(koId)).following.length;

    // Dodavanje u listu pracenih
    const korisnik = await User.findByIdAndUpdate(
      koId,
      { $addToSet: { following: kogaId } },
      { new: true, session }
    );

    // 400 BAD REQUEST ako korisnik nije dodat
    if (korisnik.following.length === broj) {
      res.status(400).json({error: 'Vec praceni korisnik'});
      return;
    }

    // Uspesno pracenje je 200 OK
    res.status(200).json(korisnik);
  } catch (err) {
    next(err);
  }
};
