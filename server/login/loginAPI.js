'use strict';

const express = require('express');

// Login je zasebna ruta
const router = express.Router();
const controller = require('./loginController');

// Zahtevi na korenoj ruti
router.post('/', controller.registrujSe);
router.put('/', controller.prijaviSe);
router.patch('/', controller.potvrdiSe);

module.exports = router;
