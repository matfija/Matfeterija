'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Active = require('../active/activeModel');
const User = require('./userModel');

module.exports.dohvatiSve = async (req, res, next) => {
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
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    if (oldPass && newPass) {
      // Mora da postoji razlika,
      // inace je 400 BAD REQUEST
      if (oldPass === newPass) {
        res.status(400).json({error: 'Iste lozinke'});
        return;
      }

      // Stara lozinka mora da se poklapa,
      // inace je 401 UNAUTHORIZED
      if (!await bcrypt.compare(oldPass, korisnik.password)) {
        res.status(401).json({error: 'Neispravna lozinka'});
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

module.exports.obrisi = async (req, res, next) => {
  try {
    // Brisanje po indentifikatoru zahteva
    const id = req.user.sub;

    // Zapocinjanje nove sesije, kako bi brisanje
    // iz spiska aktivnih i spiska svih korisnika
    // obavilo u istoj transakciji, dakle zajedno
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const aktKorisnik = await Active.findByIdAndRemove(id, { session });
      const korisnik = await User.findByIdAndRemove(id, { session });

      // Brisanje svih pracenja povezanih
      // sa obrisanim korisnikom
      await User.update({},
      { $pull: {
        followers: id,
        following: id
        }
      }, { session });

      // Uspesno brisanje je 200 OK
      res.status(200).json([korisnik, aktKorisnik]);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};

module.exports.dohvati = async (req, res, next) => {
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

module.exports.zaprati = async (req, res, next) => {
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

    // Transakciono pracenje korisnika
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Brojevi pre radnje
      const koBroj = (await User.findById(koId)).following.length;
      const kogaBroj = (await User.findById(kogaId)).followers.length;

      // Dodavanje u listu pracenih
      const koKorisnik = await User.findByIdAndUpdate(
        koId,
        { $addToSet: { following: kogaId } },
        { new: true, session }
      );

      // Obrada gresaka
      if (!koKorisnik) {
        throw Error('Nepostojeci korisnik');
      }
      if (koKorisnik.following.length === koBroj) {
        throw Error('Ponovljeno pracenje');
      }

      // Dodavanje u listu pratilaca
      const kogaKorisnik = await User.findByIdAndUpdate(
        kogaId,
        { $addToSet: { followers: koId } },
        { new: true, session }
      );
      
      // Obrada gresaka
      if (!kogaKorisnik) {
        throw Error('Nepostojeci korisnik');
      }
      if (kogaKorisnik.followers.length === kogaBroj) {
        throw Error('Ponovljeno pracenje');
      }

      // Uspesno pracenje je 200 OK
      res.status(200).json([koKorisnik, kogaKorisnik]);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};
