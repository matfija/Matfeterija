'use strict';

const User = require('./userModel');

module.exports.dohvatiSve = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dohvatiSve'});
  } catch (err) {
    next(err);
  }
};

module.exports.obrisi = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'obrisi'});
  } catch (err) {
    next(err);
  }
};

module.exports.dohvati = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dohvati'});
  } catch (err) {
    next(err);
  }
};

module.exports.zaprati = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'zaprati'});
  } catch (err) {
    next(err);
  }
};
