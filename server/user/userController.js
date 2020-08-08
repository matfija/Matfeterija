const mongoose = require('mongoose');

const User = require('./userModel');

module.exports.prijava = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'prijava'});
  } catch (err) {
    next(err);
  }
};

module.exports.registracija = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'registracija'});
  } catch (err) {
    next(err);
  }
};

module.exports.potvrda = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'potvrda'});
  } catch (err) {
    next(err);
  }
};

module.exports.brisanje = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'brisanje'});
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
