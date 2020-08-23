'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const base64Img = require('base64-img');
const randomString = require('randomstring');

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
    const korisnik = await User.findById(id).select('+password');

    // Promena lozinke korisnika
    const { oldPassword } = req.body;
    const { newPassword } = req.body;
    if (oldPassword && newPassword) {
      // Mora da postoji razlika,
      // inace je 400 BAD REQUEST
      if (oldPassword === newPassword) {
        res.status(400).json({error: 'Iste lozinke'});
        return;
      }

      // Stara lozinka mora da se poklapa,
      // inace je 400 BAD REQUEST
      if (!await bcrypt.compare(oldPassword, korisnik.password)) {
        res.status(400).json({error: 'Neispravna lozinka'});
        return;
      }

      // Nova lozinka mora biti duzine makar
      // osam, inace je 400 BAD REQUEST
      if (newPassword.length < 8) {
        res.status(400).json({error: 'Prekratka lozinka'});
        return;
      }

      // Hesiranje i cuvanje nove lozinke
      const password = await bcrypt.hash(newPassword, 12);
      korisnik.password = password;
    }

    // Promena imena za prikaz
    const { display } = req.body;
    if (display) {
      korisnik.display = display;
    }

    // Promena opisa korisnika
    const { description } = req.body;
    if (description) {
      korisnik.description = description;
    }

    // Promena avatara
    const { avatar } = req.body;
    if (avatar) {
      // Brisanje starog ako je postojao
      const stari = korisnik.avatar;
      if (stari) {
        const putanja = path.resolve(__dirname, '..', 'images',
          stari.slice(stari.lastIndexOf('/')+1));
        fs.unlinkSync(putanja);
      }

      // Cuvanje novog avatara
      const naziv = randomString.generate(8);
      korisnik.avatar = 'http://localhost:3000/' +
        base64Img.imgSync(avatar, 'images', naziv).replace('\\', '/');
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
      await User.updateMany({},
        { $pull: { followers: id } },
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
    // Dohvatanje korisnika po alasu
    const { alas } = req.params;
    const korisnik = await User.findOne({ alas })
      .populate('following').populate('followers');
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
    // Dohvatanje onog koji prati
    const koId = req.user.sub;
    const ko = await User.findById(koId);

    // Dohvatanje onog ko se prati
    const { alas } = req.params;
    const koga = await User.findOne({ alas });
    const kogaId = koga._id;

    // Nije moguce pratiti samog sebe,
    // to je 400 BAD REQUEST
    if (koId == kogaId) {
      res.status(400).json({error: 'Nemoguce pracenje'});
      return;
    }

    // Transakcioni rad
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Dodavanje u listu pracenih ili
      // izbacivanje iz nje
      const korisnik = ko.following.includes(kogaId) ?
      await User.findByIdAndUpdate(
        koId,
        { $pull: { following: kogaId } },
        { new: true, session }
      ).select('+password') :
      await User.findByIdAndUpdate(
        koId,
        { $addToSet: { following: kogaId } },
        { new: true, session }
      ).select('+password');

      // Dodavanje u listu pratilaca ili
      // izbacivanje iz nje
      koga.followers.includes(koId) ?
      await User.findByIdAndUpdate(
        kogaId,
        { $pull: { followers: koId } },
        { session }
      ) :
      await User.findByIdAndUpdate(
        kogaId,
        { $addToSet: { followers: koId } },
        { session }
      );

      // Uspesno pracenje je 200 OK
      res.status(200).json(korisnik);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};
