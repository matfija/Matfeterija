'use strict';

const Post = require('./postModel');
const Comm = require('../comm/commModel');

module.exports.dohvatiSve = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dohvatiSve'});
  } catch (err) {
    next(err);
  }
};

module.exports.dodajObjavu = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dodajObjavu'});
  } catch (err) {
    next(err);
  }
};

module.exports.dohvatiObjavu = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dohvatiObjavu'});
  } catch (err) {
    next(err);
  }
};

module.exports.dodajKomentar = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'dodajKomentar'});
  } catch (err) {
    next(err);
  }
};

module.exports.obrisiObjavu = async (req, res, next) => {
  try {
    res.status(200).json({radnja: 'obrisiObjavu'});
  } catch (err) {
    next(err);
  }
};
