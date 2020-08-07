const mongoose = require('mongoose');

const Comm = require('./commModel');

module.exports.dohvatiKomentar = async (req, res, next) => res.status(200).json({radnja: 'dohvatiKomentar'});

module.exports.obrisiKomentar = async (req, res, next) => res.status(200).json({radnja: 'obrisiKomentar'});
