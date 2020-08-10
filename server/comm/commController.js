'use strict';

const Comm = require('./commModel');

module.exports.dohvatiKomentar = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dohvatiKomentar'});
  } catch (err) {
    next(err);
  }
};

module.exports.obrisiKomentar = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'obrisiKomentar'});
  } catch (err) {
    next(err);
  }
};
