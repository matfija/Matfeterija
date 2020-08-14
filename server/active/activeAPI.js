'use strict';

const express = require('express');

// Active je zasebna ruta
const router = express.Router();
const controller = require('./activeController');

// Zahtevi na korenoj ruti
router.get('/', controller.dohvatiAktivne);
router.delete('/', controller.odjaviSe);

module.exports.router = router;

module.exports.prijavljen = controller.prijavljen;
