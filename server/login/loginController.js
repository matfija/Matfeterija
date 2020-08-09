const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../user/userModel');

const RSA_PRIVATE_KEY = fs.readFileSync('../data/private.key');

module.exports.registrujSe = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'registrujSe'});
  } catch (err) {
    next(err);
  }
};

module.exports.prijaviSe = async (req, res, next) => {
  try {
    const alas = req.body.alas;
    if (!alas) {
      res.status(401).json({error: 'fali alas'});
      return;
    }

    const password = req.body.password;
    if (!password) {
      res.status(401).json({error: 'fali password'});
      return;
    }

    const korisnik = await User.findOne({alas}).exec();
    if (!korisnik) {
      res.status(401).json({error: 'nepostojeci korisnik'});
    } else if (korisnik.password !== password) {
      res.status(401).json({error: 'los password'});
    } else {
      const id = korisnik._id.toString();

      const jwtToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 120,
        subject: id
      });

      res.cookie('SESSION_ID', jwtToken, { httpOnly: true/*, secure: true*/});

      res.status(200).json({radnja: 'prijaviSe'});
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
