'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const protonMail = require('protonmail-api');
const randomString = require('randomstring');
const pIteration = require('p-iteration');

// Model korisnika i prijave u bazi
const User = require('../user/userModel');
const Login = require('./loginModel');
const Active = require('../active/activeModel');

// Privatni kljuc za RSA enkripciju
const RSA_PRIVATE_KEY = fs.readFileSync('../data/private.key');

// Kredencijali Proton mejla; Alas nazalost blokira
// Ethereal, pa je moralo nekako drugacije, tako da
// se unapred izvinjavamo svima koji ce morati da
// otvore nalog kako bi mogli da testiraju server;
// ocekivano, nasi kredencijali su u gitignore
const protonCred = JSON.parse(fs.readFileSync('../data/proton.json'));

// Funkcija za dohvatanje kredencijala
const dohvatiKredencijale = (req, res, status) => {
  // Provera polja koje sadrzi ime na Alasu
  const { alas } = req.body;
  if (!alas || !alas.match(/^(a[fi]|m[lmrnvai])[0-1][0-9]1?[0-9]{3}$/)) {
    res.status(status).json({error: 'fali alas'});
    return null;
  }

  // Provera polja koje sadrzi lozinku
  const { password } = req.body;
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
  const kredencijali = dohvatiKredencijale(req, res, 400);
  if (!kredencijali) {
    return;
  }
  const [alas, rawPassword] = kredencijali;

  try {
    // Ne sme da se registruje vec registrovan,
    // u tom slucaju je greska 400 BAD REQUEST
    const korisnik = await User.findOne({ alas });
    if (korisnik) {
      res.status(400).json({error: 'korisnik vec postoji'});
      return;
    }

    // Isto vazi za vec postojecu prijavu
    const staraPrijava = await Login.findOne({ alas });
    if (staraPrijava) {
      res.status(400).json({error: 'prijava vec postoji'});
      return;
    }

    // Hesiranje lozinke pre cuvanja u bazi
    const password = await bcrypt.hash(rawPassword, 12);

    // Pravljenje i hesiranje potvrdnog koda
    const potvrda = randomString.generate(8);
    const authcode = await bcrypt.hash(potvrda, 12);

    // Pravljenje prijave prema shemi
    const prijava = new Login({
      _id: new mongoose.Types.ObjectId,
      alas, password, authcode
    });

    // Zapocinjanje nove sesije, kako bi se registracija
    // obavila u istoj transakciji sa slanjem mejla; ako
    // slanje mejla ne uspe, ni registracija ne treba
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Perzistiranje prijave u bazi
      const prijavaObj = await prijava.save({ session });

      // Slanje mejla sa potvrdnim kodom
      const protonSession = await protonMail.connect(protonCred);
      await protonSession.sendEmail({
        to: `${alas}@alas.matf.bg.ac.rs`,
        subject: 'Потврдни код ✔',
        body: potvrda
      })
      protonSession.close()

      // Uspesna registracija je 201 CREATED
      res.status(201).json(prijavaObj);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};

module.exports.prijaviSe = async (req, res, next) => {
  // Dohvatanje kredencijala iz tela zahteva,
  // pri cemu je neuspeh 401 UNAUTHORIZED
  const kredencijali = dohvatiKredencijale(req, res, 401);
  if (!kredencijali) {
    return;
  }
  const [alas, password] = kredencijali;

  try {
    // Provera trazenog korisnika u bazi,
    // pri cemu je neuspeh 404 NOT FOUD
    const korisnik = await User.findOne({alas}).select('+password');
    if (!korisnik) {
      res.status(404).json({error: 'nepostojeci korisnik'});
      return
    }

    // Ili 401 UNAUTHORIZED ako je greska
    if (!await bcrypt.compare(password, korisnik.password)) {
      res.status(401).json({error: 'los password'});
      return;
    }

    // Upisivanje korisnika u aktivne
    await Active.findByIdAndUpdate(
      korisnik._id, {
      alas: korisnik.alas,
      display: korisnik.display,
      avatar: korisnik.avatar,
      lastAction: Date.now()
    }, {
      new: true,
      upsert: true,
      omitUndefined: true
    });

    // Dohvatanje indentifikatora korisnika
    const id = korisnik._id.toString();

    // Potpisivanje JWT zetona/tokena
    const jwtToken = jwt.sign({}, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: 1800, // 30 min
      subject: id
    });

    // Slanje kolacica sa zetonom
    res.cookie('MATFETERIJA', jwtToken, { httpOnly: true });

    // Uspesna prijava je 200 OK
    res.status(200).json(korisnik);
  } catch (err) {
    next(err);
  }
};

module.exports.potvrdiSe = async (req, res, next) => {
  try {
    // Provera potvrdnog koda, pri cemu je neuspeh
    // 400 BAD REQUEST ako ne postoji ili ne valja
    const { authcode } = req.body;
    if (!authcode || authcode.length !== 8) {
      res.status(400).json({error: 'los authcode'});
      return;
    }

    // Dohvatanje registracije prema kodu
    const prijava = await pIteration.find(
      await Login.find(),
      async x => await bcrypt.compare(authcode, x.authcode)
    );

    // Neuspeh 400 BAD REQUEST ako ne postoji
    if (!prijava) {
      res.status(400).json({error: 'los authcode'});
      return;
    }

    // Izvlacenje kredencijala iz rezultata
    const { alas, password } = prijava;

    // Ako se slucajno dogodio duplikat
    const stariKorisnik = await User.findOne({ alas });
    if (stariKorisnik) {
      res.status(400).json({error: 'korisnik vec postoji'});
      return;
    }

    // Pravljenje korisnika prema shemi
    const korisnik = new User({
      _id: new mongoose.Types.ObjectId,
      alas, password
    });

    // Zapocinjanje nove sesije, kako bi se cuvanje
    // aktivirane registracije i brisanje neaktivirane
    // obavilo u istoj transakciji, dakle zajedno
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Perzistiranje korisnika u bazi
      const korisnikObj = await korisnik.save({ session });

      // Brisanje registracije na cekanju
      await prijava.remove({ session });

      // Uspesna potvrda je 200 OK
      res.status(200).json(korisnikObj);
    });
    session.endSession();
  } catch (err) {
    next(err);
  }
};
