const mongoose = require('mongoose');

const Post = require('./postModel');
const Comm = require('../comm/commModel');

module.exports.dohvatiSve = async (req, res, next) => res.status(200).json({radnja: 'dohvatiSve'});

module.exports.dodajObjavu = async (req, res, next) => res.status(200).json({radnja: 'dodajObjavu'});

module.exports.dohvatiObjavu = async (req, res, next) => res.status(200).json({radnja: 'dohvatiObjavu'});

module.exports.dodajKomentar = async (req, res, next) => res.status(200).json({radnja: 'dodajKomentar'});

module.exports.obrisiObjavu = async (req, res, next) => res.status(200).json({radnja: 'obrisiObjavu'});
